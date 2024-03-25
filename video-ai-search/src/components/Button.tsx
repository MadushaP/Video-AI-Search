interface iButton {
    CTA: string
    onClick: () => void
    disabled: boolean
}


export const Button = ({CTA, onClick, disabled}: iButton) => {
    return (
        <button disabled={disabled} onClick={onClick} className={`bg-blue-700 rounded-[32px] shadow-md hover:bg-blue-500 text-white font-bold py-2 px-5 ${disabled && "pointer-events-none bg-slate-300"}  `}>
            {CTA}
        </button>
    )
}