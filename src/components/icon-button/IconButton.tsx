import React from "react";
import "./IconButton.css"
import classNames from "classnames";

function IconButton(props: any) {
    return (
        <button disabled={(props.disabled) ? props.disabled : false}
                type={(props.type) ? props.type : "button"}
                className={classNames('IconBtn', props.additionalClassName)}
                style={{
                    width: props.btn_size,
                    height: props.btn_size,
                }}
                onClick={props.onClick}>

                <span className="material-symbols-outlined icon" style={{
                    fontSize: props.icon_size
                }}>
                    {props.icon_name}
                </span>
        </button>
    );

}

export default IconButton;
