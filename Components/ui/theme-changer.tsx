"use client"
import { Moon,Sun } from "lucide-react";
import { useTheme } from "next-themes";


const ThemeChanger = ()=>{
const{theme,setTheme} = useTheme()

const toggle=(e:React.MouseEvent<HTMLButtonElement>)=>{
  
   

  const newTheme = theme === "dark"? "light": "dark"
    
    const x = e.clientX
    const y = e.clientY

    document.documentElement.style.setProperty("--theme-x",`${x}px`)
    document.documentElement.style.setProperty("--theme-y",`${y}px`)

    if(!document.startViewTransition){
        setTheme(newTheme)
        return
    }
    document.startViewTransition(()=>{
        setTheme(newTheme)
    })
}
return(
    <button
    type="button"
    onClick={toggle}
    className="cursor-pointer">
        <Sun className="h-5 w-5 dark:hidden"></Sun>
        <Moon className="hidden h-5 w-5 dark:block"></Moon>

    </button>
)




}
export default ThemeChanger