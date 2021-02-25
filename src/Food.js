export default (props) => {
    return (
        <div>
            {props.foods.map((food, i) => {
                const style = {
                    left: `${food[0]*props.size}px`,
                    top: `${food[1]*props.size}px`,
                    width: `${props.size}px`,
                    height: `${props.size}px`
                }
                return (
                    <div className="snake-food" key={i} style={style}></div>
                );
            })}
        </div>
    )

}