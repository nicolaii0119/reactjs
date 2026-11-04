import type { ChangeEvent } from "react";


function Textbox({
    lbl,
    value,
    onChange
}: {
    lbl: string,
    value?: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}) {

    return (

        <>

            <label htmlFor="">
                {lbl}
            </label>

            <input
                type="text"
                className="form-control"
                value={value}
                onChange={onChange}
            />

        </>

    );

}


export default Textbox;