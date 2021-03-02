import { getRandomCoordinates } from './helpres'
import food1 from './img/food1.png';
import food2 from './img/food2.png';
import food3 from './img/food3.png';
import food4 from './img/food4.png';
import food5 from './img/food5.png';
import food6 from './img/food6.png';
import food7 from './img/food7.png';

export const generateFoods = (count, sizeArea, snakeDots) => {
    let foods = [];

    const calcUnicPosition = () => {
        let coord = getRandomCoordinates(sizeArea);
        if ((snakeDots.some((elem) => { return elem[0] === coord[0] && elem[1] === coord[1] })) ||
            (foods.some((elem) => { return elem[0] === coord[0] && elem[1] === coord[1] }))) {
            return calcUnicPosition();
        }
        return coord;
    }

    for (let i = 0; i < count; i++) {
        foods.push({
            coordinates: calcUnicPosition(),
            type: 'food' + [Math.floor(Math.random() * 7)]
        });
    }
    return foods;
}

export const Foods = (props) => {
    const outOfborder = props.size * 0.1;
    return (
        <div>
            {props.foods.map((food, i) => {
                const style = {
                    left: `${food.coordinates[0] * props.size - outOfborder / 2}px`,
                    top: `${food.coordinates[1] * props.size - outOfborder / 2}px`,
                    width: `${props.size + outOfborder}px`,
                    height: `${props.size + outOfborder}px`
                }
                let image;
                switch (food.type) {
                    case 'food2': image = food2; break;
                    case 'food3': image = food3; break;
                    case 'food4': image = food4; break;
                    case 'food5': image = food5; break;
                    case 'food6': image = food6; break;
                    case 'food7': image = food7; break;
                    default: image = food1; break;
                }

                return (
                    <img src={image} alt='#' className="snake-food" key={i} style={style} />
                );
            })}
        </div>
    )

}