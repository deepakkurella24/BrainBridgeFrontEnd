
import { useNavigate } from 'react-router-dom'
const NavBar = () => {
    const navigate=useNavigate();
  

    return (
        <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl cursor-pointer" onClick={()=>navigate('/home')} >
                {/* <GitPullRequest size={28} /> */}
                <span>BrainBridge</span>
            </div>
        </div>
        </div>
    )
}

export default NavBar