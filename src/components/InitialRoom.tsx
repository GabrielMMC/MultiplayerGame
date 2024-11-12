import React from "react";
import LobbyRoom from "./LobbyRoom";

const InitialRoom: React.FC = () => {
  const [name, setName] = React.useState("testee");
  const [isReady, setIsReady] = React.useState(false);

  return (
    <section className="d-flex">
      {!isReady && (
        <div className="col-12 my-2 input-group">
          <div className="form-floating">
            <input
              className="form-control"
              id="name"
              type="name"
              value={name}
              onChange={({ target }) => setName(target.value)}
              required
            />
            <label htmlFor="name">Nickname</label>
          </div>

          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setIsReady(true)}
            disabled={name.length < 6}
            id="button-addon2"
          >
            ✅
          </button>
        </div>
      )}
      {isReady && <LobbyRoom name={name} />}
    </section>
  );
};

export default InitialRoom;
