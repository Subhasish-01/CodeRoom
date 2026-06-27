type Varients = "primary"|"secondary"
export interface ButtonProps{
varient:Varients,
text:string;
onClick?:()=>void;
size:"sm"|"md"|"lg";
fullwidth?:boolean;
}

const varientStyles={
    "primary":"bg-purple-600 text-white  hover:scale-105",
    "secondary":"bg-purple-300 text-purple-600  hover:scale-105"
}
const sizeStyles={
    "sm":"py-1 px-2",
    "md":"py-2 px-4 pr-6",
    "lg":"py-3 px-6"
}
const defaultStyles= "rounded-md flex justify-center items-center font-light cursor-pointer transition-all duration-200 hover:shadow-xl"

export const Button=(props:ButtonProps)=>{
    return(
        <button onClick={props.onClick} className={`${varientStyles[props.varient]} ${defaultStyles} ${sizeStyles[props.size]} ${props.fullwidth?"w-full":""}`}>
            {props.text}
        </button>
    )
}