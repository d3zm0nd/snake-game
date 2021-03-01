import { getRandomCoordinates } from './helpres'
import apple from './img/apple1.png';
import orange from './img/orange.png';
import plum from './img/plum.png';

const typesFood = ['apple1', 'orange', 'plum'];

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
            type: typesFood[Math.floor(Math.random() * 3)]
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
                    case 'apple1': image = apple; break;
                    case 'orange': image = orange; break;
                    default: image = plum; break;
                }

                return (
                    <img src={image} alt='#' className="snake-food" key={i} style={style} />
                );
            })}
        </div>
    )

}