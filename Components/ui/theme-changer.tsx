"use client"

import { Moon,Sun } from "lucide-react";
import { useTheme } from "next-themes";


const ThemeChanger = ()=>{
const{setTheme} = useTheme()

const toggle=()=>{
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "light" : "dark")
}
return(
    <button
    type="button"
    onClick={toggle}>
        <Sun className="h-5 w-5 dark:hidden"></Sun>
        <Moon className="hidden h-5 w-5 dark:block"></Moon>

    </button>
)




}
export default ThemeChanger