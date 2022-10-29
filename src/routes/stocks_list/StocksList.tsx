import './StocksList.css'
import React, { useMemo, useState } from "react";
import socket from "../../features/socketConnection";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import Button from "../../components/button/Button";
import CheckBox from "../../components/checkbox/CheckBox";
import IconButton from "../../components/icon-button/IconButton";
import { BrowserView, MobileView } from 'react-device-detect'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Content(props: any) {

    const is_working = useSelector((state: any) => state.emulationIndicator.is_working);


    return props.content.map((element: any, index: number) => {
        return <tr key={element.code}>
            <td>
                <span className="centered-btns">
                    <CheckBox
                        id={index.toString()}
                        defaultChecked={(props.origChosenStocks.includes(element.code))}
                        additionalClassName=""
                        onClick={() => {
                            if (props.curChosenStocks.includes(element.code)) {
                                let index = props.curChosenStocks.indexOf(element.code);
                                let arrayCopy = [...props.curChosenStocks];
                                arrayCopy.splice(index, 1);
                                props.validateChange(arrayCopy);
                                props.setChosenStocks(arrayCopy);
                            } else {
                                let arrayCopy = [...props.curChosenStocks];
                                arrayCopy.push(element.code);
                                props.validateChange(arrayCopy);
                                props.setChosenStocks(arrayCopy);
                            }
                        }
                        }
                    />
                </span>
            </td>

            <td>{element.name}</td>
            <td>{element.code}</td>
            <td>$ {
                !is_working && <>---</>
            }
                {
                    is_working && element.value
                }
            </td>
            <td>
                <div className="centered-btns">
                    <Button additionalClassName="table-btn" text="Last Year" onClick={() => {
                        axios.post("http://localhost:3200/api/get_stock_history", {
                            is_last_year: true,
                            code: element.code
                        }).then((res) => {
                            props.showHistory(res.data, 5);
                        })
                    }}/>
                    <Button additionalClassName="table-btn" text="This Year" onClick={() => {
                        axios.post("http://localhost:3200/api/get_stock_history", {
                            is_last_year: false,
                            code: element.code
                        }).then((res) => {
                            props.showHistory(res.data, 5);
                        })
                    }}/>
                </div>
            </td>
        </tr>
    });
}

function MobileContent(props: any) {
    const is_working = useSelector((state: any) => state.emulationIndicator.is_working);

    return props.content.map((element: any, index: number) => {

        return <tr key={element.code}>
            <td>
                <span className="centered-btns">
                    <CheckBox
                        id={index.toString()}
                        defaultChecked={(props.origChosenStocks.includes(element.code))}
                        additionalClassName=""
                        onClick={() => {
                            if (props.curChosenStocks.includes(element.code)) {
                                let index = props.curChosenStocks.indexOf(element.code);
                                let arrayCopy = [...props.curChosenStocks];
                                arrayCopy.splice(index, 1);
                                props.validateChange(arrayCopy);
                                props.setChosenStocks(arrayCopy);
                            } else {
                                let arrayCopy = [...props.curChosenStocks];
                                arrayCopy.push(element.code);
                                props.validateChange(arrayCopy);
                                props.setChosenStocks(arrayCopy);
                            }
                        }
                        }
                    />
                </span>
            </td>
            <td>{element.code}</td>
            <td>
                $
                {
                    !is_working && <> ---</>
                }
                {
                    is_working && element.value
                }
            </td>
            <td>
                <div className="centered-btns">
                    <IconButton btn_size={37} icon_size={24} icon_name={"remove_red_eye"}
                                additionalClassName={"border-btn"} onClick={() => {
                        props.showData(element.name, element.code);
                    }}/>
                </div>
            </td>
        </tr>
    });
}

function HistoryContent(props: any) {
    return props.content.map((element: any) => {
        return <tr key={element.date}>
            <td>{element.date}</td>
            <td>${element.value}</td>
        </tr>
    });
}

function DrawChart(props: any) {
    return <Line options={props.options} data={props.data} height={props.chartHeight}/>
}


function StocksList(props: any) {
    const is_working = useSelector((state: any) => state.emulationIndicator.is_working);
    const navigate = useNavigate();

    const [contentObj, setContentObj] = useState([{ name: "", code: "", value: 0 }]);
    const [origChosenStocks, setOrigChosenStocks] = useState([""]);
    const [curChosenStocks, setCurChosenStocks] = useState([""]);

    const [isChanged, setIsChanged] = useState(false);

    const [isDataDialogShown, setIsDataDialogShown] = useState(false);
    const [dataDialogData, setDataDialogData] = useState({ code: "", name: "" });


    const [isHistoryDialogShown, setIsHistoryDialogShown] = useState(false);
    const [isTable, setIsTable] = useState(false);

    const [historyContentObj, setHistoryContentObj] = useState([[]]);

    socket.on('stocks_update', (data) => {
        console.log("Caught update event!");

        const parsedData = JSON.parse(data);

        let newContentObj = [...contentObj];
        for (const {code, value} of parsedData) {
            for (const obj of newContentObj) {
                if (obj.code === code) {
                    obj.value = parseFloat(value);
                }
            }
        }
        setContentObj(newContentObj);
    })

    socket.on('start', () => {
        console.log("Caught start event!");
        axios.get("http://localhost:3200/api/get_current_stocks_values")
            .then((response) => {
                if (response.status === 200) {
                    let newContentObj = [...contentObj];
                    for (const {code, value} of response.data) {
                        for (const obj of newContentObj) {
                            if (obj.code === code) {
                                obj.value = parseFloat(value);
                            }
                        }
                    }
                    setContentObj(newContentObj);
                } else {
                    console.error("Couldn't get current stocks values!");
                }
            })
    })

    socket.on('stop', () => {
        console.log("Caught stop event!");

        let newContentObj = [...contentObj];
        for (const obj of newContentObj) {
            obj.value = 0;
        }
        setContentObj(newContentObj);
    })

    useMemo(() => {
        axios.get("http://localhost:3200/api/get_available_stock_list")
            .then((res) => {
                if (res.status === 200) {
                    axios.get("http://localhost:3200/api/get_chosen_stock_list")
                        .then((res1) => {
                            if (res1.status === 200) {
                                setOrigChosenStocks(res1.data);
                                setCurChosenStocks(res1.data);
                            }
                        })
                    axios.get("http://localhost:3200/api/get_current_stocks_values")
                        .then((response) => {
                            if (response.status === 200) {
                                let newContentObj = [...res.data];
                                for (const {code, value} of response.data) {
                                    for (const obj of newContentObj) {
                                        if (obj.code === code) {
                                            obj.value = parseFloat(value);
                                        }
                                    }
                                }
                                setContentObj(newContentObj);
                            } else {
                                console.error("Couldn't get current stocks values!");
                            }
                        })
                }
            })

    }, [])

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    const [data, setData] = useState({
        labels: [""],
        datasets: [
            {
                label: 'Stock Price',
                data: [""],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                pointRadius: 10,
                pointHoverRadius: 15
            },
        ],
    });

    let chartHeight = window.innerHeight * 0.4;


    function validateChange(currentStocks: any) {
        if (origChosenStocks.length !== currentStocks.length)
            setIsChanged(true);
        else {
            let flag = false;
            for (const code of origChosenStocks) {
                if (!currentStocks.includes(code)) {
                    setIsChanged(true);
                    flag = true;
                    break;
                }
            }

            if (!flag)
                setIsChanged(false);
        }
    }

    function showHistory(data: any, divider: number) {

        let chartData = [];
        let chartLabels = [];

        for (let i = 0; i < data.length / divider; i++) {
            chartData.push(data[i * divider].value)
            chartLabels.push(data[i * divider].date)
        }

        if (!chartLabels.includes(data[data.length - 1].date)) {
            chartData.push(data[data.length - 1].value)
            chartLabels.push(data[data.length - 1].date)
        }

        setData({
            labels: chartLabels.reverse(),
            datasets: [
                {
                    label: 'Stock Price',
                    data: chartData.reverse(),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    pointRadius: 10,
                    pointHoverRadius: 15
                },
            ],
        })
        setHistoryContentObj(data);
        setIsHistoryDialogShown(true);
    }

    function showData(name: string, code: string) {
        setDataDialogData({ code: code, name: name });
        setIsDataDialogShown(true);
    }

    return (
        <>
            <BrowserView>
                <div className="stocks-list">
                    <div className="first-line">
                        <div className="line-title">Stocks List</div>
                        <Button additionalClassName="middle-btn" text="Brokers List"
                                onClick={() => navigate("/brokersList")}/>
                        <Button disabled={!isChanged || is_working} additionalClassName="" text="Apply" onClick={() => {
                            axios.post("http://localhost:3200/api/apply_current_stocks_list", {
                                list: curChosenStocks
                            }).then((res) => {
                                if (res.status === 201) {
                                    setOrigChosenStocks(curChosenStocks);
                                    setIsChanged(false);
                                }
                            })
                        }}/>
                    </div>
                    <div className="table">
                        <table>
                            <thead>
                            <tr>
                                <th></th>
                                <th>
                                    Stock Name
                                </th>
                                <th>
                                    Stock Code
                                </th>
                                <th>
                                    Current Value
                                </th>
                                <th>
                                    Value Change History
                                </th>
                            </tr>
                            </thead>
                            <tbody id="friendsTBody">
                            <Content
                                content={contentObj}
                                origChosenStocks={origChosenStocks}
                                curChosenStocks={curChosenStocks}
                                setChosenStocks={setCurChosenStocks}
                                validateChange={validateChange}
                                showHistory={showHistory}
                            />
                            </tbody>
                        </table>
                    </div>

                    <dialog className="dialog stock-info" open={isHistoryDialogShown}>
                        <IconButton btn_size={48} icon_size={48} icon_name={"close"}
                                    additionalClassName={"dialog-close"} onClick={() => {
                            setIsHistoryDialogShown(false);
                        }}/>
                        <div className="wrapper">
                            <div className="dialog-header-text">Add Broker</div>
                            <Button additionalClassName="toggle-btn" text="Toggle View" onClick={() => {
                                setIsTable(!isTable);
                            }}/>
                            {isTable &&
                                <div className="table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>
                                                Date
                                            </th>
                                            <th>
                                                Value
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody id="friendsTBody">
                                        <HistoryContent content={historyContentObj}/>
                                        </tbody>
                                    </table>
                                </div>
                            }
                            {!isTable &&
                                <DrawChart options={options} data={data} width={"100%"} height={"40vh"}/>
                            }
                        </div>
                    </dialog>
                </div>
            </BrowserView>
            <MobileView>
                <div className="stocks-list stocks-list-mobile">
                    <div className="first-line">
                        <div className="line-title">Stocks List</div>
                        <IconButton disabled={!isChanged} btn_size={48} icon_size={48} icon_name={"done"}
                                    additionalClassName={"border-btn"} onClick={() => {
                            axios.post("http://localhost:3200/api/apply_current_stocks_list", {
                                list: curChosenStocks
                            }).then((res) => {
                                if (res.status === 201) {
                                    setOrigChosenStocks(curChosenStocks);
                                    setIsChanged(false);
                                }
                            })
                        }}/>
                    </div>
                    <div className="table mobile-table">
                        <table>
                            <thead>
                            <tr>
                                <th></th>
                                <th>
                                    Stock Code
                                </th>
                                <th>
                                    Value
                                </th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody id="friendsTBody">
                            <MobileContent
                                content={contentObj}
                                origChosenStocks={origChosenStocks}
                                curChosenStocks={curChosenStocks}
                                setChosenStocks={setCurChosenStocks}
                                validateChange={validateChange}
                                showData={showData}/>
                            </tbody>
                        </table>
                    </div>

                    <dialog className="dialog mobile-dialog stock_data_dialog" open={isDataDialogShown}>
                        <div className="wrapper">
                            <div className="dialog-header-text">Stock Data</div>
                            <IconButton btn_size={38} icon_size={38} icon_name={"close"}
                                        additionalClassName={"close-btn border-btn"} onClick={() => {
                                setIsDataDialogShown(false);
                            }}/>
                            <div className="params">
                                <div className={"param"}>
                                    <div className="params-text">Stock Name:</div>
                                    <div className="params-text-Cinzel">{dataDialogData.name}</div>
                                </div>
                                <div className={"param"}>
                                    <div className="params-text">Value Change History:</div>
                                    <div className="column-btns">
                                        <Button text={"This Year"} additionalClassName={"column-btn"} onClick={() => {
                                            axios.post("http://localhost:3200/api/get_stock_history", {
                                                is_last_year: false,
                                                code: dataDialogData.code
                                            }).then((res) => {
                                                showHistory(res.data, 20);
                                            })
                                        }}/>
                                        <Button text={"Last Year"} additionalClassName={"column-btn"} onClick={() => {
                                            axios.post("http://localhost:3200/api/get_stock_history", {
                                                is_last_year: true,
                                                code: dataDialogData.code
                                            }).then((res) => {
                                                showHistory(res.data, 20);
                                            })
                                        }}/>
                                    </div>
                                </div>
                            </div>
                            <div className="control-buttons">
                                <Button text={"Close"} additionalClassName={"control-button"} onClick={() => {
                                    setIsDataDialogShown(false);
                                }}/>
                            </div>
                        </div>
                    </dialog>

                    <dialog className="dialog mobile-dialog stock_data_dialog_value" open={isHistoryDialogShown}>
                        <div className="wrapper">
                            <div className="dialog-header-text">Stock Data</div>
                            <IconButton btn_size={38} icon_size={38} icon_name={"close"}
                                        additionalClassName={"close-btn border-btn"} onClick={() => {
                                setIsHistoryDialogShown(false);
                            }}/>
                            <div className="control-buttons">
                                <Button text={"Toggle View"} additionalClassName={"toggle-button"} onClick={() => {
                                    setIsTable(!isTable);
                                }}/>
                            </div>
                            {isTable && <div className="table mobile-table dialog-table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>
                                            Date
                                        </th>
                                        <th>
                                            Value
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody id="friendsTBody">
                                    <HistoryContent content={historyContentObj}/>
                                    </tbody>
                                </table>
                            </div>}

                            {!isTable &&
                                <DrawChart options={options} data={data} height={chartHeight}/>
                            }

                        </div>
                    </dialog>
                </div>
            </MobileView>
        </>

    );
}

export default StocksList;
