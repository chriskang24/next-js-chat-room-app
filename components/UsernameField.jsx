const UsernameField = ({ value, onChange, onSubmit, completed }) => {
  if (completed) {
    // if the user has claimed a username, display it
    return (

      <div>Chatting as <b>{value}</b>
      </div>
    )

  } else {
    // let the user claim the username
    return (
      <div>
        <form onSubmit={(e) => e.preventDefault() || onSubmit(value)}>
          <label>
            Set your username:
            <input
              type="text"
              name="username"
              value={value}
              onChange={(e) => e.preventDefault() || onChange(e.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default UsernameField;