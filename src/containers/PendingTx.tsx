import { CircularProgress, Grid, IconButton } from '@material-ui/core';
import * as React from 'react';
import useInterval from 'use-interval';
import EthereumJSONRPC from '@etclabscore/ethereum-json-rpc';
import { ArrowForwardIos, ArrowBackIos } from '@material-ui/icons';
import { initReactI18next } from 'react-i18next';
import useMultiGethStore from '../stores/useMultiGethStore';
import TxList from '../components/TxList';
import getBlocks from '../helpers';
import { mockTxs } from '../helpers/mockTxs';


export default function PendingTxContainer(props: any) {
  const { pending } = props;
  const [erpc]: [EthereumJSONRPC] = useMultiGethStore();
  // const [pending, setPending]: [any, any] = React.useState([]);
  const [to, setTo]: [any, any] = React.useState(5);

  // useInterval(() => {
  //   if (!erpc) { return; }

  //   erpc.eth_pendingTransactions().then(setPending);
  // }, 5000, true);

  if (pending.length === 0) return null;

  return (
    <div className="MuiCardContent-root">
      <Grid container justify="flex-start">
        <Grid item xs={6}>
          <h2 style={{ padding: '0 16px' }}>Pending Transactions</h2>
        </Grid>
        <Grid container xs={6} justify="flex-end">
          <h3 style={{ padding: '0 16px' }}>
            Total Txs
            {' '}
            {pending.length}
          </h3>
          <IconButton onClick={() => setTo(to - 5)} disabled={to <= 5}>
            <ArrowBackIos />
          </IconButton>
          <IconButton onClick={() => setTo(to + 5)} disabled={pending.length < to}>
            <ArrowForwardIos />
          </IconButton>
        </Grid>
      </Grid>
      <TxList transactions={pending.slice(to - 5, to)} />
    </div>
  );
}
