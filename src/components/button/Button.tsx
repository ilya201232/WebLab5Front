import React from "react";
import "./Button.css"
import classNames from "classnames";

function Button(props: any) {

    return (
        <button disabled={(props.disabled) ? props.disabled : false}
                type={(props.type) ? props.type : "button"}
                className={classNames('btn', props.additionalClassName)}
                onClick={props.onClick}>
            <div className="btn-text">
                {props.text}
            </div>
        </button>
    );

}

export default Button;
