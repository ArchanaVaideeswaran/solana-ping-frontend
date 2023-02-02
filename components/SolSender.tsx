import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as Web3 from "@solana/web3.js";
import { FC, useEffect, useState } from "react";
import styles from "../styles/SolSender.module.css";

export const SolSender: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);
  const [txUrl, setTxUrl] = useState("");

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.getAccountInfo(publicKey).then((info) => {
      setBalance(info.lamports / Web3.LAMPORTS_PER_SOL);
    });
  }, [connection, publicKey, txUrl]);

  const onClick = () => {
    if (!connection || !publicKey) {
      alert("Connect Wallet!");
      return;
    }

    const recepient = new Web3.PublicKey(receiver);
    const transaction = new Web3.Transaction();
    const transferInstruction = Web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recepient,
      lamports: Web3.LAMPORTS_PER_SOL * amount,
    });
    transaction.add(transferInstruction);

    sendTransaction(transaction, connection).then((sig) => {
      const expUrl = `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
      console.log(`Explorer URL: ${expUrl}`);
      setTxUrl(expUrl);
    });
  };

  const handleAmount = (event) => {
    setAmount(event.target.value);
    console.log(event.target.value);
  };

  const handleAddress = (event) => {
    setReceiver(event.target.value);
    console.log(event.target.value);
  };

  return (
    <div className={styles.form}>
      <p>Current Balance: {balance}</p>
      <p>Send SOL to:</p>
      <input
        className={styles.formField}
        type="text"
        placeholder="SOL receiver address"
        onChange={handleAddress}
      />
      <p>Amount in SOL to send:</p>
      <input
        className={styles.formField}
        type="text"
        placeholder={`${amount} SOL`}
        onChange={handleAmount}
      />
      <button className={styles.formButton} onClick={onClick}>
        SEND
      </button>
      {txUrl ? (
        <>
          <p>
            Successfully sent {amount} SOL to {receiver}
          </p>
          <p>View your transaction on </p>
          <a href={txUrl}>Solana Explorer</a>
        </>
      ) : null}
    </div>
  );
};
