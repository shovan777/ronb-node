import { GeoJSONPointScalar } from "src/common/scalars/geojson/Point.scalar";
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublicToiletInput } from './dto/create-public-toilet.input';
import { UpdatePublicToiletInput } from './dto/update-public-toilet.input';
import {
  PublicToilet,
  PublicToiletImage,
} from './entities/public-toilet.entity';
import { uploadFileStream } from '../common/utils/upload';
import { PublishState as PublicToiletState } from "src/common/enum/publish_state.enum";

@Injectable()
export class PublicToiletService {
  constructor(
    @InjectRepository(PublicToilet)
    private publicToiletRepository: Repository<PublicToilet>,
    @InjectRepository(PublicToiletImage)
    private publicToiletImageRepository: Repository<PublicToiletImage>,
  ) {}
  uploadDir = process.env.MEDIA_ROOT;

  async create(
    publicToiletInput: CreatePublicToiletInput,
    user: number
  ): Promise<PublicToilet> {
    let publicToiletInputData = {
      ...publicToiletInput,
      singleImage: null,
      images: null,
    };
    if (publicToiletInput.singleImage) {
      const imageFile: any = await publicToiletInput.singleImage;
      const file_name = imageFile.filename;
      const upload_dir = this.uploadDir;
      const file_path = await uploadFileStream(
        imageFile.createReadStream,
        upload_dir,
        file_name,
      );
      publicToiletInputData = {
        ...publicToiletInputData,
        singleImage: file_path,
      };
    }
    const publicToiletData: PublicToilet =
      await this.publicToiletRepository.save({
        ...publicToiletInputData,
        publishedAt: publicToiletInput.state === PublicToiletState.PUBLISHED ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user,
        updatedBy: user,
      });
    if (publicToiletInput.images) {
      const imagePaths = publicToiletInput.images.map(async (image) => {
        const imageFile: any = await image;
        const fileName = imageFile.filename;
        const uploadDir = this.uploadDir;
        const filePath = await uploadFileStream(
          imageFile.createReadStream,
          uploadDir,
          fileName,
        );
        return filePath;
      });
      const publicToiletImages: Promise<PublicToiletImage>[] = imagePaths.map(
        async (imagePath) => {
          return await this.publicToiletImageRepository.save({
            image: await imagePath,
            createdAt: new Date(),
            updatedAt: new Date(),
            publicToilet: publicToiletData,
            createdBy: user,
            updatedBy: user,
          });
        },
      );
      publicToiletInputData = {
        ...publicToiletInputData,
        images: await Promise.all(publicToiletImages),
      };
    }

    return await publicToiletData;
  }

  async findAll(
    limit: number,
    offset: number,
    publishedOnly = false,
  ): Promise<[PublicToilet[], number]> {
    const whereOptions: any = {};
    if (publishedOnly) {
      whereOptions.state = PublicToiletState.PUBLISHED;
    }
    return this.publicToiletRepository.findAndCount({
      take: limit,
      skip: offset,
      where: {
        ...whereOptions
      },
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: number) {
    const publicToilet = await this.publicToiletRepository.findOne({
      where: { id: id },
      relations: { images: true },
    });
    if (publicToilet) {
      return publicToilet;
    }
    return new NotFoundException(`PublicToilet with id ${id} not found`);
  }

  async update(id: number, updatePublicToiletInput: UpdatePublicToiletInput, user: number) {
    const publicToilet: PublicToilet =
      await this.publicToiletRepository.findOne({
        where: { id: id },
      });
    if (publicToilet) {
      let publicToiletInputData = {
        ...updatePublicToiletInput,
        singleImage: null,
      };
      if (updatePublicToiletInput.singleImage) {
        const imageFile: any = await updatePublicToiletInput.singleImage;
        const file_name = imageFile.filename;
        const upload_dir = this.uploadDir;
        const file_path = await uploadFileStream(
          imageFile.createReadStream,
          upload_dir,
          file_name,
        );
        publicToiletInputData = {
          ...publicToiletInputData,
          singleImage: file_path,
        };
        publicToilet.singleImage = publicToiletInputData.singleImage;
      }
      if (updatePublicToiletInput.images) {
        const imagePaths = updatePublicToiletInput.images.map(async (image) => {
          const imageFile: any = await image;
          const fileName = imageFile.filename;
          const uploadDir = this.uploadDir;
          const filePath = await uploadFileStream(
            imageFile.createReadStream,
            uploadDir,
            fileName,
          );
          return filePath;
        });
        const publicToiletImages: Promise<PublicToiletImage>[] = imagePaths.map(
          async (imagePath) => {
            return await this.publicToiletImageRepository.save({
              image: await imagePath,
              createdAt: new Date(),
              updatedAt: new Date(),
              publicToilet: publicToilet,
              createdBy: user,
              updatedBy: user,
            });
          },
        );
        await Promise.all(publicToiletImages);
      }
      const { images, ...updatedPublicToilet } = {
        ...publicToilet,
        ...publicToiletInputData,
        publishedAt: publicToilet.publishedAt || (updatePublicToiletInput.state === PublicToiletState.PUBLISHED ? new Date() : null),
        updatedAt: new Date(),
        updatedBy: user,
      };
      return this.publicToiletRepository.save(updatedPublicToilet);
    }
    throw new NotFoundException(`PublicToilet with id ${id} not found`);
  }

  async remove(id: number) {
    const publicToilet: PublicToilet =
      await this.publicToiletRepository.findOne({
        where: { id: id },
        relations: { images: true },
      });

    if (publicToilet) {
      const deleteImage = publicToilet.images.map(async (image) => {
        return await this.publicToiletImageRepository.delete(image.id);
      });
      await Promise.all(deleteImage);
      await this.publicToiletRepository.delete(publicToilet.id);
      return publicToilet;
    }
    return new NotFoundException(`PublicToilet with id ${id} not found`);
  }

  async findImagesOfPublicToilet(id: number) {
    const publicToilet: PublicToilet =
      await this.publicToiletRepository.findOne({
        where: { id: id },
        relations: { images: true },
      });
    if (publicToilet) {
      return publicToilet.images;
    }
    return new NotFoundException(`PublicToilet with id ${id} not found`);
  }

  async findPublicToiletNearMe(limit:number, offset:number, origin: GeoJSONPointScalar): Promise<[PublicToilet[], number]> {
      let distance = 40;
      const publicToilet = await this.publicToiletRepository
      .createQueryBuilder()
      .where('ST_DWithin(geopoint, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(geopoint)), :distance)')
      .setParameters({
          origin: JSON.stringify(origin),
          distance: distance*1000, //KM conversion
      })
      .limit(limit)
      .offset(offset)
      .getMany();
      return [publicToilet, publicToilet.length];
  }
}
    