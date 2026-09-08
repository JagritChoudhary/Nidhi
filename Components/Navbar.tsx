import { KeyRoundIcon } from "lucide-react"
import ThemeChanger from "./ui/theme-changer"


const Navbar = ()=>{
return(
    <nav className="flex w-full justify-between items-center  sticky top-0 z-50 border-b border-gray-900 dark:border-gray-400 p-2">
        <div className="flex gap-2 justify-center items-center">
            <KeyRoundIcon></KeyRoundIcon>
            <h1 className="text-xl tracking-tighter font-bold">NIDHI</h1>
        </div>

        <div>
            <ThemeChanger></ThemeChanger>
        </div>
    </nav>
)
}
export default Navbar