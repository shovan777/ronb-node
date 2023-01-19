import { GraphQLScalarType, GraphQLError } from "graphql";

import { Scalar } from '@nestjs/graphql';

const GJV = require("geojson-validation");

import parseLiteral from './parseLiteral';

const validate = (value: any) => {
    if (!GJV.isPoint(value)) {
        throw new GraphQLError(`Expected GeoJSON Point but got: ${JSON.stringify(value)}`);
    }
    return value;
}

// export default new GraphQLScalarType({
//     name: "GeoJSONPointScalar",
//     serialize: validate,
//     parseValue: validate,
//     parseLiteral: ast => validate(parseLiteral(ast))
// });

@Scalar('GeoJSONPointScalar')
export class GeoJSONPointScalar {
    description = 'GeoJSON Point';

    parseValue(value) {
        return validate(value);
    }

    serialize(value) {
        return validate(value);
    }

    parseLiteral(ast) {
        return validate(parseLiteral(ast));
    }
}
