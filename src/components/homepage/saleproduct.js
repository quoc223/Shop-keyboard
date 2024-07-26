
import "./style.scss"
import item1 from "../../assets/main-item/akko-5075b-plus-s-dracula-castle-280x280.png"
import item2 from "../../assets/main-item/akko-keycap-set-neon-07-280x280.png"
import item3 from "../../assets/main-item/Akko-Hamster-X-wireless-Hima-01-280x280.png"
import item4 from "../../assets/main-item/akko-cs-pom-switch-silver-ava-280x280.png"
import item5 from "../../assets/main-item/day-cap-custom-AKKO-macaw-ava-280x280.png"
import React from 'react';
function SaleProduct(){
    var items = [
        {
            name:"Keyboard",
            srcimg: item1,          
        },
        {
            name:"Keycaps",
            srcimg: item2
        },
        {
            name:"Mouse",
            srcimg:item3
        },
        {
            name:"Switch",
            srcimg:item4
        },
        {
            name:"Accessories",
            srcimg:item5
        }
    ]
    return(
        <div className="tagsale">
            {
                items.map((item,i) => (   
                   <div key={i} className="tagimg">
                        <img className="imgsale" alt="" src={item.srcimg} loading="lazy"/>  
                        <h3>{item.name}</h3>
                   </div>
            ))
            } 
        </div>
    )
}

export default SaleProduct;