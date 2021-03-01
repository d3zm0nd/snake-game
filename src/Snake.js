import head from './img/head.png'
import tail from './img/tail.png'
import body from './img/body.png'
import turn from './img/turn.png'

const snake = (props) => {
    const data = props.snakeDots.filter((dot) => {
        return (dot[0] !== null && dot[1] !== null);
    });
    const calculateSegmet = (i) => {
        let result = { type: 'body', degree: 0 };
        const elem = data[i];
        const nextElem = data[i + 1];
        const prevElem = data[i - 1];
        const getDegree = (direction) => {
            switch (direction) {
                case 'LEFT': return 180; 
                case 'UP': return 270;
                case 'DOWN': return 90;
                case 'RIGHT':
                default: return 0; 
            }
        }

        if (i === data.length - 1) {
            result.type = 'head';
            if (prevElem[0] > elem[0]) {
                result.degree = getDegree('LEFT');
            }
            if (prevElem[1] < elem[1]) {
                result.degree = getDegree('DOWN');
            }
            if (prevElem[1] > elem[1]) {
                result.degree = getDegree('UP');
            }
            return result;
        }

        if (i === 0) {
            result.type = 'tail';
            if (elem[0] < nextElem[0]) {
                result.degree = getDegree('RIGHT');
                return result;
            }
            if (elem[0] > nextElem[0]) {
                result.degree = getDegree('LEFT');
                return result;
            }
            if (nextElem[1] > elem[1]) {
                result.degree = getDegree('DOWN');
                return result;
            }
            if (nextElem[1] < elem[1]) {
                result.degree = getDegree('UP');
                return result;
            }
        }

        if (prevElem[0] === elem[0] && elem[0] === nextElem[0]) {
            result.type = 'body';
            result.degree = getDegree('UP');
            return result;
        }

        if ((elem[0] === prevElem[0] && elem[1] < prevElem[1] && elem[0] < nextElem[0] && elem[1] === nextElem[1]) ||
            (elem[0] < prevElem[0] && elem[1] === prevElem[1] && elem[0] === nextElem[0] && elem[1] < nextElem[1])
        ) {
            result.type = 'turn';
            return result;
        }

        if ((elem[0] === prevElem[0] && elem[1] > prevElem[1] && elem[0] < nextElem[0] && elem[1] === nextElem[1]) ||
            (elem[0] < prevElem[0] && elem[1] === prevElem[1] && elem[0] === nextElem[0] && elem[1] > nextElem[1])
        ) {
            result.type = 'turn';
            result.degree = getDegree('UP');
            return result;
        }

        if ((elem[0] > prevElem[0] && elem[1] === prevElem[1] && elem[0] === nextElem[0] && elem[1] < nextElem[1]) ||
            (elem[0] === prevElem[0] && elem[1] < prevElem[1] && elem[0] > nextElem[0] && elem[1] === nextElem[1])
        ) {
            result.type = 'turn';
            result.degree = getDegree('DOWN');
            return result;
        }

        if ((elem[0] > prevElem[0] && elem[1] === prevElem[1] && elem[0] === nextElem[0] && elem[1] > nextElem[1]) ||
            (elem[0] === prevElem[0] && elem[1] > prevElem[1] && elem[0] > nextElem[0] && elem[1] === nextElem[1])
        ) {
            result.type = 'turn';
            result.degree = getDegree('LEFT');
            return result;
        }



        else return result;
    }

    return (
        <div>
            {data.map((dot, i) => {
                const segment = calculateSegmet(i);

                const style = {
                    left: `${dot[0] * props.size}px`,
                    top: `${dot[1] * props.size}px`,
                    width: `${props.size}px`,
                    height: `${props.size}px`,
                    transform: `rotate(${segment.degree}deg)`
                }
                let image;
                let classNames = ['snake-dot'];
                switch (segment.type) {
                    case 'head': image = head; break;
                    case 'tail': image = tail; break;
                    case 'turn': image = turn; break;
                    default: image = body; break;
                }

                return (
                    <img src={image} alt='*' className={classNames.join(' ')} key={i} style={style} x={dot[0]} y={dot[1]} />
                );
            })}
        </div>
    )
}

export default snake;