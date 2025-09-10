"use client";

import React, { useState, useEffect } from "react";

const rovers = [
  {
    name: "Curiosity",
    cameras: ["FHAZ", "RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"],
  },
  {
    name: "Opportunity",
    cameras: ["FHAZ", "RHAZ", "NAVCAM", "PANCAM", "MINITES"],
  },
  { name: "Spirit", cameras: ["FHAZ", "RHAZ", "NAVCAM", "PANCAM", "MINITES"] },
];

const MarsExplorer = () => {
  interface Photo {
    id: number;
    img_src: string;
    rover: {
      name: string;
    };
    camera: {
      name: string;
      full_name: string;
    };
    earth_date: string;
  }

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRover, setSelectedRover] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_KEY = "FwBorDtfLprcbM7ioof9zfBopfeGR1AVsolRmdqi";

  useEffect(() => {
    if (API_KEY === "FwBorDtfLprcbM7ioof9zfBopfeGR1AVsolRmdqi") {
      setError(null);
    } else {
      setError("Please replace the API_KEY with your actual NASA API key.");
      return;
    }

    const fetchPhotos = async () => {
      setLoading(true);
      try {
        let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover}/photos?api_key=${API_KEY}&page=${page}`;

        if (selectedCamera) {
          url += `&camera=${selectedCamera}`;
        }
        if (selectedDate) {
          url += `&earth_date=${selectedDate}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setPhotos(data.photos);
        setHasMore(data.photos.length > 0);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedRover, selectedCamera, selectedDate, page]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const selectedRoverData = rovers.find((r) => r.name === selectedRover);
  const availableCameras =
    selectedRover && rovers.find((r) => r.name === selectedRover)
      ? rovers.find((r) => r.name === selectedRover)?.cameras || []
      : Array.from(new Set(rovers.flatMap((r) => r.cameras)));

  const filteredPhotos = photos.filter((photo) => {
    const roverMatch = photo.rover.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const cameraMatch = photo.camera.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return roverMatch || cameraMatch;
  });

  return (
    <div className="body text-white d-flex flex-column min-vh-100">
      <header className="header container-fluid position-fixed p-4 shadow-sm text-center">
        <a
          href="#"
          className="d-flex justify-content-center align-items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-rocket-takeoff"
            viewBox="0 0 16 16"
          >
            <path d="M9.752 6.193c.599.6 1.73.437 2.528-.362s.96-1.932.362-2.531c-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532" />
            <path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9 9 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a10 10 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087.582 12.623.208c.89-.217 1.59-.232 2.08-.188.244.023.435.06.57.093q.1.026.16.045c.184.06.279.13.351.295l.029.073a3.5 3.5 0 0 1 .157.721c.055.485.051 1.178-.159 2.065m-4.828 7.475.04-.04-.107 1.081a1.54 1.54 0 0 1-.44.913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a9 9 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006M5.205 5c-.625.626-.94 1.351-1.004 2.09a9 9 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a3 3 0 0 0-.045-.283 3 3 0 0 0-.3-.041Z" />
            <path d="M7.009 12.139a7.6 7.6 0 0 1-1.804-1.352A7.6 7.6 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z" />
          </svg>
          <h1 className="logo m-0">UniverseEx</h1>
        </a>
      </header>

      <div className="main-header container-fluid text-center">
        <h2 className="display-4 fw-bold">Mars Exploration Gallery</h2>
        <p className="lead">
          Explore stunning images and data from Mars missions.
        </p>
        <a href="#filters" className="btn btn-outline-light">
          View Gallery
        </a>
      </div>

      <main className="container my-5 flex-grow-1">
        <div className="filters p-4 rounded shadow-sm">
          <div className="filter-search d-flex align-items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-funnel"
              viewBox="0 0 16 16"
            >
              <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
            </svg>
            <h4 className="m-0">Filters & Search</h4>
          </div>

          <div className="search-bar mb-4">
            <label htmlFor="searchInput" className="">
              Search by rover or camera name:
            </label>
            <input
              type="text"
              id="searchInput"
              className="form-control rounded"
              placeholder="Type for rover or camera name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="filter-options d-flex gap-3 w-100" id="filters">
            <div className="filter-option d-flex flex-column">
              <label htmlFor="missionDropdown">Select a rover:</label>
              <div className="dropdown rounded w-100">
                <button
                  className="btn text-white dropdown-toggle w-100 text-start"
                  type="button"
                  id="missionDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedRover || "Choose a rover"}
                </button>
                <ul className="dropdown-menu" aria-labelledby="missionDropdown">
                  {rovers.map((rover) => (
                    <li key={rover.name}>
                      <button
                        className="dropdown-item rounded"
                        onClick={() => {
                          setSelectedRover(rover.name);
                          setPage(1);
                        }}
                      >
                        {rover.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="filter-option d-flex flex-column">
              <label htmlFor="cameraDropdown">Select a camera:</label>
              <div className="dropdown rounded w-100">
                <button
                  className="btn text-white dropdown-toggle w-100 text-start"
                  type="button"
                  id="cameraDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedCamera || "Choose a camera"}
                </button>
                <ul className="dropdown-menu" aria-labelledby="cameraDropdown">
                  {availableCameras.map((camera) => (
                    <li key={camera}>
                      <button
                        className="dropdown-item rounded"
                        onClick={() => {
                          setSelectedCamera(camera);
                          setPage(1);
                        }}
                      >
                        {camera}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="filter-option d-flex flex-column">
              <label htmlFor="date-input" className="">
                Selecionar Data:
              </label>
              <input
                type="date"
                id="date-input"
                className="rounded"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="d-flex flex-column justify-content-center text-center my-4">
            <div className="spinner-border mb-2 m-auto" role="status">
            </div>
            <p className="text-center m-0">Loading photos...</p>
          </div>
        )}
        {error && <p className="text-center my-4 text-danger">{error}</p>}
        {!loading && !error && filteredPhotos.length === 0 && (
          <p className="text-center my-4">No photos found.</p>
        )}

        <div className="gallery mt-4" id="gallery">
          <section className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="col">
                <div className="card h-100 text-white">
                  <img
                    src={photo.img_src}
                    className="card-img-top object-fit-cover"
                    style={{ height: "200px" }}
                    alt={`Mars Rover Photo taken by ${photo.rover.name}`}
                    loading="lazy"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/400x300/4B5563/FFFFFF?text=Imagem+Nao+Encontrada")
                    }
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{photo.rover.name}</h5>
                    <p className="card-subtitle mb-3">
                      {photo.camera.full_name}
                    </p>
                    <p className="card-text mb-1">
                      <small className="d-flex align-items-center gap-1">
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                          />
                        </svg>
                        {photo.earth_date}
                      </small>
                    </p>
                    <p className="card-text">
                      <small className="d-flex align-items-center gap-1">
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
                          />
                          <path
                            stroke="currentColor"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                        {photo.camera.name}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="pagination d-flex justify-content-center align-items-center my-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1 || loading}
            className={`btn rounded-pill me-2 ${
              page === 1 || loading ? "disabled" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-left me-1"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z"
              />
            </svg>
            Previous
          </button>
          <span className="text-light fs-5 mx-2">Page {page}</span>
          <button
            onClick={handleNextPage}
            disabled={loading || !hasMore}
            className={`btn rounded-pill ms-2 ${
              !hasMore || loading ? "disabled" : ""
            }`}
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-right ms-1"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </button>
        </div>
      </main>

      <footer className="p-4 text-light mt-auto">
        <div className="d-flex justify-content-between gap-4 w-75">
          <div className="footer-header">
            <div className="footer-logo d-flex align-items-center gap-1 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-rocket-takeoff"
                viewBox="0 0 16 16"
              >
                <path d="M9.752 6.193c.599.6 1.73.437 2.528-.362s.96-1.932.362-2.531c-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532" />
                <path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9 9 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a10 10 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087.582 12.623.208c.89-.217 1.59-.232 2.08-.188.244.023.435.06.57.093q.1.026.16.045c.184.06.279.13.351.295l.029.073a3.5 3.5 0 0 1 .157.721c.055.485.051 1.178-.159 2.065m-4.828 7.475.04-.04-.107 1.081a1.54 1.54 0 0 1-.44.913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a9 9 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006M5.205 5c-.625.626-.94 1.351-1.004 2.09a9 9 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a3 3 0 0 0-.045-.283 3 3 0 0 0-.3-.041Z" />
                <path d="M7.009 12.139a7.6 7.6 0 0 1-1.804-1.352A7.6 7.6 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z" />
              </svg>
              <h1 className="logo m-0">UniverseEx</h1>
            </div>
            <p className="text-start">
              Exploring the cosmos through data and imagery. Bringing Mars
              closer to Earth through cutting-edge space exploration technology.
            </p>
            <div className="social-icons d-flex gap-2">
              <a href="#" className="text-decoration-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M 12 1.9960938 C 6.4870865 1.9960938 1.9980469 6.4871845 1.9980469 12 C 1.9980469 16.677334 5.2220333 20.619398 9.5761719 21.701172 A 0.750075 0.750075 0 0 0 10.507812 20.972656 L 10.505859 16.025391 C 10.505859 15.766334 10.570059 15.533634 10.6875 15.316406 A 0.750075 0.750075 0 0 0 10.232422 14.238281 C 8.5307239 13.754483 7.4960938 12.633845 7.4960938 11.492188 C 7.4960938 10.858209 7.8013565 10.252189 8.4003906 9.7226562 A 0.750075 0.750075 0 0 0 8.640625 9.0253906 C 8.5799541 8.6938075 8.6097328 8.347841 8.5878906 8.0117188 C 8.9540667 8.200798 9.3482465 8.3268801 9.6835938 8.5898438 A 0.750075 0.750075 0 0 0 10.347656 8.7226562 C 10.850285 8.5827944 11.404585 8.5097656 11.994141 8.5097656 C 12.582602 8.5097656 13.137996 8.5827947 13.640625 8.7226562 A 0.750075 0.750075 0 0 0 14.304688 8.5917969 C 14.641312 8.3286502 15.035371 8.2011271 15.402344 8.0117188 C 15.380504 8.347908 15.410149 8.6944396 15.349609 9.0253906 A 0.750075 0.750075 0 0 0 15.589844 9.7226562 C 16.189391 10.252643 16.496094 10.859346 16.496094 11.492188 C 16.496094 12.634799 15.464799 13.742356 13.761719 14.240234 A 0.750075 0.750075 0 0 0 13.314453 15.318359 C 13.432133 15.534106 13.496094 15.766298 13.496094 16.025391 L 13.494141 20.972656 A 0.750075 0.750075 0 0 0 14.425781 21.701172 C 18.778065 20.619335 22.001953 16.677334 22.001953 12 C 22.001953 6.4871845 17.512913 1.9960938 12 1.9960938 z M 12 3.4960938 C 16.701087 3.4960938 20.501953 7.2988155 20.501953 12 C 20.501953 15.627166 18.183201 18.621141 14.994141 19.841797 L 14.996094 16.025391 C 14.996094 15.767521 14.875049 15.551989 14.8125 15.3125 C 16.590724 14.574639 17.996094 13.262697 17.996094 11.492188 C 17.996094 10.508176 17.517403 9.6415889 16.84375 8.9296875 C 16.951338 8.1958754 17.018307 7.4557338 16.960938 6.6914062 A 0.750075 0.750075 0 0 0 15.976562 6.0351562 C 15.183927 6.2993525 14.431753 6.7248824 13.710938 7.234375 C 13.157543 7.1085115 12.590385 7.0097656 11.994141 7.0097656 C 11.397137 7.0097656 10.830778 7.1085116 10.277344 7.234375 C 9.5571954 6.7246554 8.8040733 6.2989375 8.0136719 6.0351562 A 0.750075 0.750075 0 0 0 7.0292969 6.6894531 C 6.9699699 7.4560742 7.0387269 8.1962242 7.1464844 8.9296875 C 6.4729761 9.642007 5.9960938 10.509169 5.9960938 11.492188 C 5.9960936 13.262529 7.4026224 14.583169 9.1875 15.314453 C 9.12572 15.55323 9.0058594 15.768835 9.0058594 16.025391 L 9.0058594 16.503906 L 8.2480469 16.503906 C 7.995794 16.503906 7.8383185 16.419446 7.6054688 16.205078 C 7.3726189 15.990709 7.1214946 15.648063 6.8320312 15.289062 A 0.750075 0.750075 0 0 0 6.2480469 15.001953 A 0.750075 0.750075 0 0 0 5.6660156 16.230469 C 5.9135523 16.53747 6.1907403 16.942963 6.5878906 17.308594 C 6.9850409 17.674224 7.5572998 18.003906 8.2480469 18.003906 L 9.0078125 18.003906 L 9.0078125 19.841797 C 5.8172078 18.621106 3.4980469 15.627166 3.4980469 12 C 3.4980469 7.2988155 7.2989135 3.4960938 12 3.4960938 z"></path>
                </svg>
              </a>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 50 50"
                >
                  <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-explore">
            <h5 className="text-start mb-3">Explore</h5>
            <ul className="list-unstyled text-start">
              <li className="mb-2">
                <a href="#" className="text-decoration-none">
                  Photo Gallery
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none">
                  Mars Rovers
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none">
                  Missions
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none">
                  Raw Data
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-resources">
            <h5 className="text-start mb-3">Resources</h5>
            <ul className="list-unstyled text-start">
              <li className="mb-2">
                <a href="#" className="text-decoration-none">
                  Nasa API
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none">
                  Documentation
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none">
                  Support
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="footer-text text-center">
          &copy; 2024 UniverseEx. Space exploration data powered by NASA's Mars
          Rover Photos API.
        </div>
      </footer>
    </div>
  );
};

export default MarsExplorer;