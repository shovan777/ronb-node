import { Scalar } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';

// import { GraphQLScalarType } from 'graphql';
// export const uploadScalar = new GraphQLScalarType({
//   name: 'Upload',
//   description: 'Upload files',
//   serialize: (value) => value,
//   parseValue: (value) => value,
//   parseLiteral: (ast) => ast,
// });

@Scalar('Upload')
export class Upload {
  description = 'Upload files';

  parseValue(value) {
    return GraphQLUpload.parseValue(value);
  }

  serialize(value) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast) {
    return GraphQLUpload.parseLiteral(ast, ast.value);
  }
}
