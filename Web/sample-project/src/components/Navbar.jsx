import{NavLink} from react-router-dom
const Nav=()=>{const linksdata=[{title:Home,
    path:'/'},{title:Products,
    path:'/products'},
    {title:Contact,
        path:'/contact'
    },

]  return(<>
<div className="w-screen to-90%,h-69 justify-center items-center"></div>
    <div className="shadow,lg-screen"></div>
    THIS IS MY SUPER STORE
    < div className="bg-white">
    {linksdata.map(link,index)=>(NavLink to={link.path}key={index}className=>{link.title}</NavLink>
    </div>
    className</>
    )
}
export defualt App
