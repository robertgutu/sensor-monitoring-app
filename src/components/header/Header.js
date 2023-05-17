function Header(){
    return(
        <nav className="navbar navbar-dark bg-primary navbar-expand-lg ">
        <div className="container-fluid">
          <a className="navbar-brand">DataTracker</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link active" href="/">Home</a>
              <a className="nav-link active" href="/predictions">Predictions</a>
              <a className="nav-link active" href="/map">Map</a>
              <a className="nav-link active" href="/add-node">Add node</a>
            </div>
          </div>
        </div>
      </nav>
    )
}
export default Header;