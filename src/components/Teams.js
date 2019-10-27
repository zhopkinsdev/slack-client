import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";

const Wrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #3e149c;
  color: #d9cfd9;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`;

const List = styled.ul`
  width: 100%;
  padding-left: 0;
  list-style: none;

  @media (max-width: 768px) {
    padding-top: 0;
    margin-bottom: 10px;
  }
`;

const ListItem = styled.li`
  height: 50px;
  width: 50px;
  background-color: #8aabbf;
  color: #fff;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 11px;
  &:hover {
    border-style: solid;
    border-width: thick;
    border-color: #809eb0;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 2rem;
    display: inline-block;
    text-align: center;
    padding-top: 16px;
    margin-left: 20px;
    background: rgb(175, 105, 255);
    font-family: "Arial";
    font-weight: 500;
    border-radius: 5px;
    &:hover {
      border-style: none;
      border-width: none;
      border-color: none;
      cursor: pointer;
    }
  }
`;

const Back = styled.div`
  color: #93a5ad;
  display: block;
  margin-bottom: 50%;
  transform: translate(0, -50%);
  font-size: 2.2rem;

  @media (max-width: 768px) {
    margin-bottom: 0;
    font-size: 1.5rem;
    margin-right: 20px;
  }
`;

const team = ({ id, letter }) => (
  <Link key={`team-${id}`} to={`/view-team/${id}`}>
    <ListItem>{letter}</ListItem>
  </Link>
);

export default ({ teams }) => (
  <Wrapper>
    <List>
      {teams.map(team)}
      <Link key="add-team" to={`/create-team`}>
        <ListItem>+</ListItem>
      </Link>
    </List>

    <Link key="home" to={`/`} style={{ marginTop: "10px" }}>
      <Back>
        <Icon style={{ color: "#af69ff" }} name="home" />
      </Back>
    </Link>
  </Wrapper>
);
