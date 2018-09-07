import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Title from "./common/Title";
import Button from "./common/Button";

const Container = styled.div`
  border-bottom: 1px solid lightgrey;
`;

const ContentContainer = styled.div`
  margin: 8px;
  display: flex;
  justify-content: space-between;
`;

const StyledTitle = styled(Title)`
  margin: 0 !important;
`;

const handleClick = () => {
  alert("you clicked the new column button!");
};

const BoardHeader = ({ title }) => (
  <Container>
    <ContentContainer>
      <StyledTitle className="is-4">{title}</StyledTitle>
      <Button className="is-info" onClick={handleClick}>
        <FontAwesomeIcon icon={faPlus} />
        &nbsp; Column
      </Button>
    </ContentContainer>
  </Container>
);

export default BoardHeader;
