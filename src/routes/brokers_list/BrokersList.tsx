import './BrokersList.css'
import React, { useEffect, useMemo, useState } from "react";

import Button from "../../components/button/Button";
import { BrowserView, MobileView } from 'react-device-detect'
import IconButton from "../../components/icon-button/IconButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function Content(props: any) {
    const is_working = useSelector((state: any) => state.emulationIndicator.is_working);

    return props.content.map((element: any, index: number) => {
        return <tr key={element.full_name}>
            <td>{element.full_name}</td>
            <td>${element.init_money}</td>
            <td>
                <div className="centered-btns">
                    <Button disabled={is_working} additionalClassName="table-btn" text="Edit Broker" onClick={() => {
                        props.setEditDialogData({
                            orig_name: element.full_name,
                            name: element.full_name,
                            money: element.init_money
                        });
                        props.openDialog();
                    }}/>
                    <Button disabled={is_working} additionalClassName="table-btn" text="Remove Broker" onClick={() => {
                        axios.post("http://localhost:3200/api/delete_broker", {
                            name: element.full_name
                        }).then(() => {
                            window.location.reload();
                        })
                    }}/>
                </div>
            </td>
        </tr>
    });
}

function MobileContent(props: any) {
    return props.content.map((element: any, index: number) => {
        return <tr key={element.full_name}>
            <td>{element.full_name}</td>
            <td>
                <div className="centered-btns">
                    <IconButton btn_size={37} icon_size={24} icon_name={"edit"} additionalClassName={"border-btn"}
                                onClick={() => {
                                    props.setEditDialogData({
                                        orig_name: element.full_name,
                                        name: element.full_name,
                                        money: element.init_money
                                    });
                                    props.setIsEditDialogOpen(true);
                                }}/>
                </div>
            </td>
        </tr>
    });
}

function BrokersList(props: any) {
    const is_working = useSelector((state: any) => state.emulationIndicator.is_working);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [editValid, setEditValid] = useState(true);
    const [addValid, setAddValid] = useState(false);

    const [editDialogData, setEditDialogData] = useState({ orig_name: "", name: "", money: "" });
    const [addDialogData, setAddDialogData] = useState({ name: "", money: "" });

    const navigate = useNavigate();

    const [contentObj, setContentObj] = useState([{}]);

    useEffect(() => {
        axios.get("http://localhost:3200/api/get_brokers_list").then((res) => {
            if (res.status === 200) {
                setContentObj(res.data);
            }
        })
    }, [])

    function validateEditForm(data: any) {
        setEditValid(!(data.money === '' || data.name === ''));
    }

    function validateAddForm(data: any) {
        setAddValid(!(data.money === '' || data.name === ''));
    }

    return (<>
            <BrowserView>
                <div className="brokers-list">
                    <div className="first-line">
                        <div className="line-title">Brokers List</div>
                        <Button additionalClassName="middle-btn" text="Stocks List"
                                onClick={() => navigate("/stocksList")}/>
                        <Button disabled={is_working} additionalClassName="" text="Add Broker" onClick={() => {
                            setIsAddDialogOpen(true)
                        }}/>
                    </div>
                    <div className="table">
                        <table>
                            <thead>
                            <tr>
                                <th>
                                    Full Name
                                </th>
                                <th>
                                    Initial amount of money
                                </th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody id="friendsTBody">
                            <Content content={contentObj} setEditDialogData={setEditDialogData} openDialog={() => {
                                setIsEditDialogOpen(true)
                            }}/>
                            </tbody>
                        </table>
                    </div>

                    <dialog className="dialog add-broker-form" id="addBrokerForm" open={isAddDialogOpen}>
                        <form className="wrapper">
                            <div className="dialog-header-text">Add Broker</div>
                            <div className="params">
                                <div className="params-names">
                                    <div className="params-text">Full Name:</div>
                                    <div className="params-text">Initial money:</div>
                                </div>
                                <div className="params-inputs">
                                    <input type={"text"} onChange={(event) => {
                                        setAddDialogData({ name: event.target.value, money: addDialogData.money });
                                        validateAddForm({ name: event.target.value, money: addDialogData.money });
                                    }}/>
                                    <input type={"number"} onChange={(event) => {
                                        setAddDialogData({ name: addDialogData.name, money: event.target.value });
                                        validateAddForm({ name: addDialogData.name, money: event.target.value });
                                    }}/>
                                </div>
                            </div>
                            <div className="control-buttons">
                                <Button text="Cancel" type="button" additionalClassName="" onClick={() => {
                                    setIsAddDialogOpen(false)
                                }}/>
                                <Button disabled={!addValid} text="Add" additionalClassName="" onClick={() => {
                                    axios.post("http://localhost:3200/api/add_broker", {
                                        name: addDialogData.name,
                                        init_money: parseInt(addDialogData.money)
                                    }).then(() => {
                                        window.location.reload();
                                    })
                                }}/>
                            </div>
                        </form>
                    </dialog>

                    <dialog className="dialog edit-broker-form" id="editBrokerForm" open={isEditDialogOpen}>
                        <form className="wrapper">
                            <div className="dialog-header-text">Edit Broker</div>
                            <div className="params">
                                <div className="params-names">
                                    <div className="params-text">Full Name:</div>
                                    <div className="params-text">Initial money:</div>
                                </div>
                                <div className="params-inputs">
                                    <input type={"text"} value={editDialogData.name} onChange={(event) => {
                                        setEditDialogData({
                                            orig_name: editDialogData.orig_name,
                                            name: event.target.value,
                                            money: editDialogData.money
                                        });
                                        validateEditForm({
                                            orig_name: editDialogData.orig_name,
                                            name: event.target.value,
                                            money: editDialogData.money
                                        });
                                    }}/>
                                    <input type={"number"} value={editDialogData.money} onChange={(event) => {
                                        setEditDialogData({
                                            orig_name: editDialogData.orig_name,
                                            name: editDialogData.name,
                                            money: event.target.value
                                        });
                                        validateEditForm({
                                            orig_name: editDialogData.orig_name,
                                            name: editDialogData.name,
                                            money: event.target.value
                                        });
                                    }}/>
                                </div>
                            </div>
                            <div className="control-buttons">
                                <Button text="Cancel" additionalClassName="" onClick={() => {
                                    setIsEditDialogOpen(false)
                                }}/>
                                <Button text="Apply" additionalClassName="" disabled={!editValid} onClick={() => {
                                    axios.post("http://localhost:3200/api/edit_broker", {
                                        orig_name: editDialogData.orig_name,
                                        new_name: editDialogData.name,
                                        init_money: editDialogData.money
                                    }).then(() => {
                                        window.location.reload();
                                    })
                                }}/>
                            </div>
                        </form>
                    </dialog>
                </div>
            </BrowserView>
            <MobileView>
                <div className="brokers-list brokers-list-mobile">
                    <div className="first-line">
                        <div className="line-title">Brokers List</div>
                        <IconButton btn_size={48} icon_size={48} icon_name={"add"}
                                    additionalClassName={"border-btn"} onClick={() => {
                            setIsAddDialogOpen(true);
                        }}/>
                    </div>
                    <div className="table mobile-table">
                        <table>
                            <thead>
                            <tr>
                                <th>
                                    Full Name
                                </th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody id="friendsTBody">
                            <MobileContent content={contentObj} setIsEditDialogOpen={setIsEditDialogOpen}
                                           setEditDialogData={setEditDialogData}/>
                            </tbody>
                        </table>
                    </div>

                    <dialog className="dialog mobile-dialog add-broker-form" id="addBrokerForm" open={isAddDialogOpen}>
                        <form className="wrapper">
                            <div className="dialog-header-text">Add Broker</div>
                            <div className="params">
                                <div className={"param"}>
                                    <div className="params-text">Full Name:</div>
                                    <input type={"text"} onChange={(event) => {
                                        setAddDialogData({ name: event.target.value, money: addDialogData.money });
                                        validateAddForm({ name: event.target.value, money: addDialogData.money });
                                    }}/>
                                </div>
                                <div className={"param"}>
                                    <div className="params-text">Initial Money:</div>
                                    <input type={"number"} onChange={(event) => {
                                        setAddDialogData({ name: addDialogData.name, money: event.target.value });
                                        validateAddForm({ name: addDialogData.name, money: event.target.value });
                                    }}/>
                                </div>
                            </div>
                            <div className="control-buttons">
                                <IconButton btn_size={64} icon_size={48} icon_name={"cancel"}
                                            additionalClassName={"border-btn"} onClick={() => {
                                    setIsAddDialogOpen(false);
                                }}/>
                                <IconButton disabled={!addValid} btn_size={64} icon_size={48} icon_name={"add"}
                                            additionalClassName={"border-btn"} onClick={() => {
                                    axios.post("http://localhost:3200/api/add_broker", {
                                        name: addDialogData.name,
                                        init_money: addDialogData.money
                                    }).then(() => {
                                        window.location.reload();
                                    })

                                }}/>
                            </div>
                        </form>
                    </dialog>

                    <dialog className="dialog mobile-dialog edit-broker-form" id="editBrokerForm"
                            open={isEditDialogOpen}>
                        <form className="wrapper">
                            <div className="dialog-header-text">Edit Broker</div>
                            <IconButton btn_size={64} icon_size={48} icon_name={"delete"}
                                         additionalClassName={"border-btn"} onClick={() => {
                                axios.post("http://localhost:3200/api/delete_broker", {
                                    name: editDialogData.name
                                }).then(() => {
                                    window.location.reload();
                                })
                            }}/>
                            <div className="params">
                                <div className={"param"}>
                                    <div className="params-text">Full Name:</div>
                                    <input value={editDialogData.name} onChange={(event) => {
                                        setEditDialogData({
                                            orig_name: editDialogData.orig_name,
                                            name: event.target.value,
                                            money: editDialogData.money
                                        });
                                        validateEditForm({
                                            orig_name: editDialogData.orig_name,
                                            name: event.target.value,
                                            money: editDialogData.money
                                        });
                                    }}/>
                                </div>
                                <div className={"param"}>
                                    <div className="params-text">Initial Money:</div>
                                    <input value={editDialogData.money} onChange={(event) => {
                                        setEditDialogData({
                                            orig_name: editDialogData.orig_name,
                                            name: editDialogData.name,
                                            money: event.target.value
                                        });
                                        validateEditForm({
                                            orig_name: editDialogData.orig_name,
                                            name: editDialogData.name,
                                            money: event.target.value
                                        });
                                    }}/>
                                </div>
                            </div>
                            <div className="control-buttons">
                                <IconButton btn_size={64} icon_size={48} icon_name={"cancel"}
                                            additionalClassName={"border-btn"} onClick={() => {
                                    setIsEditDialogOpen(false);
                                }}/>
                                <IconButton disabled={!editValid} btn_size={64} icon_size={48} icon_name={"done"}
                                            additionalClassName={"border-btn"} onClick={() => {
                                    axios.post("http://localhost:3200/api/edit_broker", {
                                        orig_name: editDialogData.orig_name,
                                        new_name: editDialogData.name,
                                        init_money: editDialogData.money
                                    }).then(() => {
                                        window.location.reload();
                                    })
                                }}/>
                            </div>
                        </form>
                    </dialog>
                </div>
            </MobileView>
        </>

    );
}

export default BrokersList;
