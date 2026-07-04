interface InputProps{
  placeholder:string,
  inputref?:any
  fullwidth?:boolean,
  type?:string

}

export const Input=(props:InputProps)=>{
    return(
        <input ref={props.inputref} placeholder={props.placeholder} type={props.type || "text"}    className={`
        px-4 py-2 border rounded
        ${props.fullwidth ? "w-full" : ""}
      `}/>
    )
}