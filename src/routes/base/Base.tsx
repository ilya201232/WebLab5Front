import './Base.css'
import React, { useEffect, useMemo, useState } from "react";

import Button from "../../components/button/Button";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { BrowserView, MobileView } from 'react-device-detect'
import IconButton from "../../components/icon-button/IconButton";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../features/emulation_indicator/emulationIndicator";
import axios from "axios";
import socket from "../../features/socketConnection";

function Base() {
    //TODO - get data from server
    const is_working = useSelector((state: any) => state.emulationIndicator.is_working);
    const current_date = useSelector((state: any) => state.emulationIndicator.current_date);
    const start_date = useSelector((state: any) => state.emulationIndicator.start_date);
    const interval = useSelector((state: any) => state.emulationIndicator.interval);

    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('connect', () => {
            console.log("Connected!");
            let data = {
                is_working: false,
                current_date: "",
                start_date: "",
                interval: 0
            };
            axios.get("http://localhost:3200/api/get_sim_data")
                .then((response) => {
                    console.log(response)
                    if (response.status === 200) {
                        if (response.data.is_working) {
                            data.is_working = true;
                            data.start_date = response.data.start_date;
                            data.interval = response.data.day_length;
                            axios.get("http://localhost:3200/api/get_sim_date")
                                .then((response) => {
                                    if (response.status === 200) {
                                        data.current_date = response.data;

                                        dispatch(updateData(data));
                                    } else {
                                        console.error("Couldn't get current sim day!");
                                    }
                                })
                        } else {
                            data.is_working = false;
                            data.current_date = "";
                            data.start_date = "";
                            data.interval = 0;

                            dispatch(updateData(data));
                        }
                    } else {
                        console.error("Couldn't get current sim data!");
                    }
                })
        });

        socket.on('disconnect', () => {
            console.log("Disconnected!");
            let data = {
                is_working: false,
                current_date: "",
                start_date: "",
                interval: 0
            };

            dispatch(updateData(data))
        });

        socket.on('update', () => {
            console.log("Caught update event!");
            let data = {
                is_working: true,
                current_date: "",
                start_date: start_date,
                interval: interval
            };
            axios.get("http://localhost:3200/api/get_sim_date")
                .then((response) => {
                    if (response.status === 200) {
                        data.current_date = response.data;

                        dispatch(updateData(data));
                    } else {
                        console.error("Couldn't get current sim day!");
                    }
                })
        })

        socket.on('start', () => {
            console.log("Caught start event!");
            let data = {
                is_working: true,
                current_date: "",
                start_date: "",
                interval: 0
            };
            axios.get("http://localhost:3200/api/get_sim_data")
                .then((response) => {
                    console.log(response)
                    if (response.status === 200) {
                        if (response.data.is_working) {
                            data.is_working = true;
                            data.start_date = response.data.start_date;
                            data.interval = response.data.day_length;
                            axios.get("http://localhost:3200/api/get_sim_date")
                                .then((response) => {
                                    if (response.status === 200) {
                                        data.current_date = response.data;

                                        dispatch(updateData(data));
                                    } else {
                                        console.error("Couldn't get current sim day!");
                                    }
                                })
                        } else {
                            data.is_working = false;
                            data.current_date = "";
                            data.start_date = "";
                            data.interval = 0;

                            dispatch(updateData(data));
                        }
                    } else {
                        console.error("Couldn't get current sim data!");
                    }
                })
        })

        socket.on('stop', () => {
            console.log("Caught stop event!");

            let data = {
                is_working: false,
                current_date: "",
                start_date: "",
                interval: 0
            };

            dispatch(updateData(data))
        })

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('update');
            socket.off('start');
            socket.off('stop');
        };
    });

    const navigate = useNavigate();

    const [isBlindShown, setIsBlindShown] = useState(false);

    return <>
        <BrowserView>
            <div className="Base">
                <div className="header">
                    <div className="left-header">
                        <span className="material-symbols-outlined header-icon"> attach_money </span>
                        <div className="header-text">Exchange Manager</div>
                    </div>
                    <div className="right-header">
                        <div className="header-text">
                            <div className={"current-date-display"}>
                                <div>Current Day:</div>
                                <div>{current_date === "" && "--/--/----"}
                                    {current_date !== "" && current_date}</div>
                            </div>
                        </div>
                        <Button additionalClassName="header-btn" text="Control" onClick={() => navigate("/control")}/>
                    </div>
                </div>
                <div className="content-wrapper">
                    <Outlet/>
                </div>
            </div>
        </BrowserView>
        <MobileView>
            <div className="Base-mobile">
                <div className="header">
                    <IconButton btn_size={48} icon_size={48} icon_name={"menu"} additionalClassName={"burger-btn"}
                                onClick={() => {
                                    setIsBlindShown(true);
                                }}/>
                    <div className="header-text">Exchange Manager</div>
                </div>
                <div className={classNames("left-blind", { shown: isBlindShown })}>
                    <div className="header-text">Choose Window</div>
                    <div className="redirect-btns">
                        <Button text={"Stocks List"} additionalClassName={"redirect-btn"} onClick={() => {
                            setIsBlindShown(false);
                            navigate("/stocksList");
                        }}/>
                        <Button text={"Broker List"} additionalClassName={"redirect-btn"} onClick={() => {
                            setIsBlindShown(false);
                            navigate("/brokersList")
                        }}/>
                        <Button text={"Control"} additionalClassName={"redirect-btn"} onClick={() => {
                            setIsBlindShown(false);
                            navigate("/control")
                        }}/>
                    </div>
                    <div className={"current-day-text"}>
                        <div className="header-text">Current Day:</div>
                        <div className="header-text">{current_date === "" && "--/--/----"}
                            {current_date !== "" && current_date}</div>
                    </div>
                </div>
                <div className={classNames("right-blind", { shown: isBlindShown })} onClick={() => {
                    setIsBlindShown(false);
                }}></div>
                <div className="content-wrapper">
                    <Outlet/>
                </div>
            </div>
        </MobileView>
    </>
}

export default Base;
