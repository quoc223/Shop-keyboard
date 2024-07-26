import "./style.scss"
import {React} from "react"
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'
import Banner1 from './assets//baner/5075B-Plus-goku-naruto-1400x510.jpg';

function CarouselLayout(props)
{
    var items = [
        {
            baner: "https://i.ibb.co/Yd4NDs6/5075-B-Plus-goku-naruto-1400x510.jpg",          
        },
        {
            baner: "https://i.ibb.co/KWHhWF9/AKKO-3068-B-banner-01-1400x510.jpg"
        },
        {
            baner:"https://i.ibb.co/yVrD0sV/ban-phim-co-akko-3098-multi-modes-banner-1920x700-01-Akkovn-1400x511.jpg"
        },
        {
            baner:"https://i.ibb.co/JBm5yk1/M1-Banner-1400x510.jpg"
        }
    ]

    return (
        <Carousel>
            {
                items.map((item, i) => <Item key={i} item={item} /> )
            }
        </Carousel>
    )
}

function Item(props)
{
    return (
        <Paper>
            <img className="imgbaner" alt="Remy Sharp" src={props.item.baner} />  
        </Paper>
    )
}
export default CarouselLayout; 