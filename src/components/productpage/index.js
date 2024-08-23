import {React} from "react"
import CarouselLayout from "../homepage/carousel";
import SaleProduct from "../homepage/saleproduct";
import ListProduct from "../homepage/listpoduct";
const Product =()=>{
    return(
        <> 
            <CarouselLayout />
            <SaleProduct />
            <ListProduct />
            {/* <UploadImage /> */}
            
        </>
    )
}
export default Product;