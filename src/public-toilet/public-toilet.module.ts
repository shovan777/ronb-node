import { Module } from "@nestjs/common";
import { PublicToiletService } from "./public-toilet.service";
import { PublicToiletResolver } from "./public-toilet.resolver";
import { Upload } from "src/common/scalars/upload.scalar";
import { GeoJSONPointScalar } from "src/common/scalars/geojson/Point.scalar";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicToilet, PublicToiletImage } from "./entities/public-toilet.entity";

@Module({
    providers: [PublicToiletResolver, PublicToiletService, Upload, GeoJSONPointScalar],
    imports: [
        TypeOrmModule.forFeature([PublicToilet, PublicToiletImage]),
    ],
    exports: [PublicToiletService]
})

export class PublicToiletModule {}