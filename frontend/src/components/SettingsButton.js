import React from "react";
import Modal from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import Button from "./common/Button";
import { NavbarButton } from "../styles/styledComponents";

import "../styles/Modal.css";

export default class SettingsButton extends React.Component {
  state = { open: false };

  onOpenModal = () => this.setState({ open: true });

  onCloseModal = () => this.setState({ open: false });

  render() {
    const { open } = this.state;

    return (
      <NavbarButton>
        <Button
          className="is-info is-rounded is-inverted is-outlined"
          onClick={this.onOpenModal}
        >
          <FontAwesomeIcon icon={faCog} />
          &nbsp;Settings
        </Button>

        <Modal
          open={open}
          onClose={this.onCloseModal}
          center
          classNames={{ modal: "custom-modal" }}
        >
          <p>Settings Here</p>
        </Modal>
      </NavbarButton>
    );
  }
}