interface IResponse {
  statusCode: number;
  headers?: any;
  body: string;
}

const buildResponse = (statusCode: number, body: object): IResponse => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
};

export const success = (body: object): IResponse => buildResponse(200, body);
export const failure = (statusCode: number = 500, body: object): IResponse =>
  buildResponse(statusCode, body);
