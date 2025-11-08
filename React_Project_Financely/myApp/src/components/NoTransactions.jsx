import React from "react";

const NoTransactions = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        marginBottom: "2rem",
      }}
    >
      <img src="" style={{ width: "400px", margin: "4rem" }} />
      <p style={{ textAlign: "center", fontSize: "1.2re" }}>
        You Have No Transactions Currently
      </p>
    </div>
  );
};

export default NoTransactions;
