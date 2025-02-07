/* eslint-disable consistent-return */
import JadeServiceRunner, { ObjectT84Ta8SE as IAvailableServices } from '@etclabscore/jade-service-runner-client';
import React, { Dispatch, useEffect } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';

// eslint-disable-next-line max-len
function useServiceRunner(defaultUrl: string): [JadeServiceRunner | undefined, string, Dispatch<string>, IAvailableServices[]] { // tslint:disable-line
  const [url, setUrl] = React.useState(defaultUrl);
  const [serviceRunner, setServiceRunner] = React.useState<JadeServiceRunner | undefined>();
  const [availableServices, setAvailableServices] = React.useState<IAvailableServices[]>([]);
  const [rpcUrlQuery] = useQueryParam('rpcUrl', StringParam);
  React.useEffect(() => {
    if (process.env.REACT_APP_ETH_RPC_URL || rpcUrlQuery) {
      return;
    }
    if (!url) {
      return;
    }
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return;
    }
    let rpc;
    try {
      const protocol = parsedUrl.protocol.split(':')[0] as any;
      const fallbackPort = protocol === 'http' ? 80 : 443;
      const port = parseInt(parsedUrl.port, 10);
      rpc = new JadeServiceRunner({
        transport: {
          host: parsedUrl.hostname,
          port: port || fallbackPort,
          type: protocol,
        },
      });
    } catch (e) {
      return;
    }
    if (rpc) {
      setServiceRunner(rpc);
    }
    return () => {
      if (serviceRunner) {
        serviceRunner.rpc.requestManager.close();
      }
    };
  }, [url]);
  useEffect(() => {
    if (serviceRunner) {
      serviceRunner.listServices('available').then(setAvailableServices);
    }
  }, [serviceRunner]);
  return [serviceRunner, url, setUrl, availableServices];
}

export default useServiceRunner;
