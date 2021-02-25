export default (props) => {
    return (
        <div>
            {props.snakeDots.map((dot, i) => {
                const style = {
                    left: `${dot[0]*props.size}px`,
                    top: `${dot[1]*props.size}px`,
                    width: `${props.size}px`,
                    height: `${props.size}px`
                }
                let className = 'snake-dot';
                if (i === props.snakeDots.length - 1) {
                    className += ' snake-dot--head';
                } else {
                    if (i % 2) {
                        className += ' snake-dot--gray';
                    }
                }

                return (
                    <div className={className} key={i} style={style}></div>
                );
            })}
        </div>
    )
}