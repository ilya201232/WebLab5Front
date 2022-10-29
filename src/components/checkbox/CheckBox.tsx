import React, { useEffect, useState } from "react";
import "./CheckBox.css"
import classNames from "classnames";

function CheckBox(props: any) {

    const [checked, setChecked] = useState(props.defaultChecked);

    useEffect(() => {
        setChecked(props.defaultChecked)
    }, [props.defaultChecked])

    return (
        <div className="CheckBox">
            <input
                type="checkbox"
                id={props.id}
                checked={checked}
                className={classNames('custom-checkbox', props.additionalClassName)}
                onChange={() => {
                    setChecked(!checked);
                    props.onClick()
                }}
            />
            <label htmlFor={props.id}></label>
        </div>

    );
}

export default CheckBox;
