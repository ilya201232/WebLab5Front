import React from 'react';
import './App.css';

import Base from './routes/base/Base';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BrokersList from "./routes/brokers_list/BrokersList";
import StocksList from "./routes/stocks_list/StocksList";
import Control from "./routes/control/Control";

const router = createBrowserRouter([
        {
            path: "/",
            element: <Base/>,
            children: [
                {
                    path: "brokersList",
                    element: <BrokersList/>,
                },
                {
                    path: "stocksList",
                    element: <StocksList/>,
                },
                {
                    path: "control",
                    element: <Control/>,
                }
            ]
        }
    ]
)

class App extends React.Component {
    render() {
        return (
            <RouterProvider router={router}/>
        );
    }
}

export default App;
