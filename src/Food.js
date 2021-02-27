import apple from './apple.png'

export default (props) => {
    const outOfborder = props.size*0.2;
    return (
        <div>
            {props.foods.map((food, i) => {
                const style = {
                    left: `${food[0]*props.size - outOfborder/2}px`,
                    top: `${food[1]*props.size - outOfborder/2}px`,
                    width: `${props.size+ outOfborder}px`,
                    height: `${props.size+ outOfborder}px`
                }
                return (
                    <img src={apple} className="snake-food" key={i} style={style}/>
                );
            })}
        </div>
    )

}