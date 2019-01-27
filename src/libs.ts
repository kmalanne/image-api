interface Response {
  statusCode: number;
  body: string;
}

const _buildResponse = (statusCode: number, body: object): Response => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

export const success = (body: object): Response => _buildResponse(200, body);
export const failure = (statusCode: number = 500, body: object): Response =>
  _buildResponse(statusCode, body);
