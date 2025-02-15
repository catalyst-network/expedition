import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import EthereumJSONRPC from '@etclabscore/ethereum-json-rpc';
import useMultiGethStore from '../stores/useMultiGethStore';
import BlockView from '../components/BlockView';
import { getTxs } from '../helpers';

export default function Block(props: any) {
  const { match: { params: { hash } } } = props;
  const [erpc]: [EthereumJSONRPC] = useMultiGethStore();
  const [block, setBlock]: [any, any] = React.useState();
  const [transactions, setTransactions]: [any, any] = React.useState();

  React.useEffect(() => {
    if (!erpc) { return; }
    erpc.eth_getBlockByHash(hash, true).then((bloc) => {
      setBlock(bloc);
      if (bloc.transactions.length > 0 && typeof bloc.transactions[0] === 'object') {
        setTransactions(bloc.transactions);
      } else {
        getTxs(bloc.transactions, erpc).then(setTransactions);
      }
    });
  }, [hash, erpc]);
  if (!block) { return (<CircularProgress />); }
  return (<BlockView block={block} transactions={transactions || []} />);
}
