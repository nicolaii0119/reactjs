function Button({
    color,
    lbl,
    onClick
}: {
    color: string,
    lbl: string,
    onClick?: () => void
}) {

    return (

        <button
            className={`btn ${color} form-control`}
            onClick={onClick}
        >
            {lbl}
        </button>

    );

}


export default Button;