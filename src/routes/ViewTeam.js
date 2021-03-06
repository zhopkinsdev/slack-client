import React from "react";
import { Redirect } from "react-router-dom";
import { compose, graphql } from "react-apollo";
import { meQuery } from "../graphql/team";
import findIndex from "lodash/findIndex";

import Header from "../components/Header";
import Layout from "../components/Layout";
import SendMessage from "../components/SendMessage";
import OnlineUserWrapper from "../components/OnlineUsers";
import Sidebar from "../container/Sidebar";
import MessageContainer from "../container/MessageContainer";
import Me from "../components/Me";
import gql from "graphql-tag";

const ViewTeam = ({
  mutate,
  data: { loading, me },
  match: {
    params: { teamId, channelId }
  }
}) => {
  if (loading || !me) {
    return null;
  }
  const { id: currentUserId, username, teams } = me;

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  // const teamIdInteger = parseInt(teamId, 10);
  const teamIndex = teamId ? findIndex(teams, ["id", parseInt(teamId, 10)]) : 0;
  const team = teamIndex === -1 ? teams[0] : teams[teamIndex];

  // const channelIdInteger = parseInt(channelId, 10);
  const channelIndex = channelId
    ? findIndex(team.channels, ["id", parseInt(channelId, 10)])
    : 0;
  const channel =
    channelIndex === -1 ? team.channels[0] : team.channels[channelIndex];

  return (
    <Layout className="app-layout">
      <OnlineUserWrapper />
      <Sidebar
        className="side-bar_view-message"
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
          name: t.name
        }))}
        team={team}
        username={username}
        currentUserId={currentUserId}
      />
      {channel && <Header channelName={channel.name} />}
      {channel && (
        <MessageContainer
          className="message-container_view-message"
          channelId={channel.id}
          username={username}
        />
      )}
      {channel && (
        <SendMessage
          className="send-message_view-message"
          channelId={channel.id}
          placeholder={channel.name}
          onSubmit={async text => {
            return mutate({
              variables: { text, channelId: channel.id }
            });
          }}
        />
      )}
      <Me username={username} />
    </Layout>
  );
};

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: "network-only" } }),
  graphql(createMessageMutation)
)(ViewTeam);
