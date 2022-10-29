import './Control.css'
import React, { useState } from "react";

import Button from "../../components/button/Button";
import { BrowserView, MobileView } from 'react-device-detect'
import IconButton from "../../components/icon-button/IconButton";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";


function Control(props: any) {

    const is_working = useSelector((state: any) => state.emulationIndicator.is_working);
    const start_date = useSelector((state: any) => state.emulationIndicator.start_date);
    const interval = useSelector((state: any) => state.emulationIndicator.interval);

    const isPlaying = false;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ day: "", speed: 0 });
    const [isValid, setIsValid] = useState(false);

    function validateForm(formData:any) {
        let startDate = new Date(formData.day);
        let today = new Date();

        today.setDate(today.getDate() - 1);

        let flag = false;

        if (startDate > today || startDate < new Date(2015, 1, 1) || formData.day === ""){
            flag = true;
            setIsValid(false);
        }

        if (formData.speed <= 0 || !formData.speed){
            flag = true;
            setIsValid(false);
        }

        if (!flag) {
            setIsValid(true);
        }


    }

    return (
        <>
            <BrowserView>
                <div className="Control">
                    <div className="first-line">
                        <div className="line-title">Control Page</div>
                        <Button text="Brokers List" additionalClassName="changeBtn" onClick={() => navigate("/brokersList")}/>
                    </div>
                    <form className="control-form">
                        <div className="params">
                            <div className="params-names">
                                <div className="params-text">Start Day:</div>
                                <div className="params-text">Day length (sec):</div>
                            </div>
                            <div className="params-inputs">
                                <input type={"date"} disabled={is_working} value={(is_working) ? start_date : formData.day} onChange={(event) => {
                                    setFormData({day: event.target.value, speed: formData.speed});
                                    validateForm({day: event.target.value, speed: formData.speed});
                                }}/>
                                <input type={"number"} disabled={is_working} value={(is_working) ? interval : formData.speed} onChange={(event) => {
                                    setFormData({day: formData.day, speed: parseInt(event.target.value)});
                                    validateForm({day: formData.day, speed: parseInt(event.target.value)});
                                }}/>
                            </div>
                        </div>
                        {!is_working && <Button disabled={!isValid} text="Start Trading" additionalClassName="control-btn" onClick={() => {
                            axios.post("http://localhost:3200/api/start_sim", {
                                start_day: formData.day,
                                day_len: formData.speed
                            })
                        }}/>}
                        {is_working && <Button text="Stop Trading" additionalClassName="control-btn" onClick={() => {
                            axios.get("http://localhost:3200/api/stop_sim")
                        }}/>}
                    </form>

                </div>
            </BrowserView>
            <MobileView>
                <div className="Control Control-mobile">
                    <div className="first-line">
                        <div className="line-title">Control Page</div>
                    </div>
                    <form className="control-form">
                        <div className="params">
                            <div className={"param"}>
                                <div className="params-text">Start Day:</div>
                                <input type={"date"} disabled={is_working} value={(is_working) ? start_date : formData.day} onChange={(event) => {
                                    setFormData({day: event.target.value, speed: formData.speed});
                                    validateForm({day: event.target.value, speed: formData.speed});
                                }}/>
                            </div>
                            <div className={"param"}>
                                <div className="params-text">Day length (sec):</div>
                                <input type={"number"} disabled={is_working} value={(is_working) ? interval : formData.speed} onChange={(event) => {
                                    setFormData({day: formData.day, speed: parseInt(event.target.value)});
                                    validateForm({day: formData.day, speed: parseInt(event.target.value)});
                                }}/>
                            </div>
                        </div>
                        {!is_working && <Button disabled={!isValid} text="Start Trading" additionalClassName="control-btn" onClick={() => {
                            axios.post("http://localhost:3200/api/start_sim", {
                                start_day: formData.day,
                                day_len: formData.speed
                            })
                        }}/>}
                        {is_working && <Button text="Stop Trading" additionalClassName="control-btn" onClick={() => {
                            axios.get("http://localhost:3200/api/stop_sim")
                        }}/>}
                    </form>

                </div>
            </MobileView>
        </>

    );
}

export default Control;
