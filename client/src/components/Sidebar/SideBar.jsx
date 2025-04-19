import React from 'react';
import './_sidebar.css'; // Update with actual path to your CSS

const SideBar = () => {
  return (
    <div id="nav-bar">
      <input type="checkbox" id="nav-toggle" />

      <div id="nav-header">
        <a id="nav-title" href="https://codepen.io" target="_blank" rel="noopener noreferrer">
          C<i className="fab fa-codepen"></i>DEPEN
        </a>
        <label htmlFor="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
        <hr />
      </div>

      <div id="nav-content">
        <div className="nav-button"><i className="fas fa-palette"></i><span>Your Work</span></div>
        <div className="nav-button"><i className="fas fa-images"></i><span>Assets</span></div>
        <div className="nav-button"><i className="fas fa-thumbtack"></i><span>Pinned Items</span></div>
        <hr />
        <div className="nav-button"><i className="fas fa-heart"></i><span>Following</span></div>
        <div className="nav-button"><i className="fas fa-chart-line"></i><span>Trending</span></div>
        <div className="nav-button"><i className="fas fa-fire"></i><span>Challenges</span></div>
        <div className="nav-button"><i className="fas fa-magic"></i><span>Spark</span></div>
        <hr />
        <div className="nav-button"><i className="fas fa-gem"></i><span>Codepen Pro</span></div>

        <div id="nav-content-highlight"></div>
      </div>

      <input type="checkbox" id="nav-footer-toggle" />

      <div id="nav-footer">
        <div id="nav-footer-heading">
          <div id="nav-footer-avatar">
            <img src="https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547" alt="User Avatar" />
          </div>
          <div id="nav-footer-titlebox">
            <a
              id="nav-footer-title"
              href="https://codepen.io/uahnbu/pens/public"
              target="_blank"
              rel="noopener noreferrer"
            >
              uahnbu
            </a>
            <span id="nav-footer-subtitle">Admin</span>
          </div>
          <label htmlFor="nav-footer-toggle">
            <i className="fas fa-caret-up"></i>
          </label>
        </div>

        <div id="nav-footer-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </div>
    </div>
  );
};

export default SideBar;
