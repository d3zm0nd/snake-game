export default (props) => {
    return (
            <button type="button" className="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
               {props.text}
          </button>
    )
}