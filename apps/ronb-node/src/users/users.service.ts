import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource('usersConnection')
    private userDataSource: DataSource,
  ) {}
  async findOne(id: number) {
    const user = await this.userDataSource
      .createQueryBuilder()
      .from('account_user', 'account_user')
      .where('account_user.id = :id', { id: id })
      .getRawOne();

    if (user) {
      user.profile = await this.userDataSource
        .createQueryBuilder()
        .from('account_profile', 'account_profile')
        .where('account_profile.user_id = :id', { id: id })
        .getRawOne();
    }
    // console.log(user);
    // if (!user) {
    //   throw new NotFoundException(`User with id ${id} not found`);
    // }
    return user;
  }

  async findAllDoners(limit: number, offset: number) {
    const users = await this.userDataSource
      .createQueryBuilder()
      .from('account_user', 'account_user');
    const totalQueryCount = Object.keys(await users.getRawMany()).length;
    let queryOut = await users.take(limit).skip(offset).getRawMany();
    await Promise.all(
      queryOut.map(async (user) => {
        user.profile = await this.userDataSource
          .createQueryBuilder()
          .from('account_profile', 'account_profile')
          .where('account_profile.user_id = :id', { id: user.id })
          .getRawOne();
      }),
    );

    queryOut = queryOut.filter(
      (query) => query.profile.blood_group_approval === true,
    );
    return { doners: queryOut, count: totalQueryCount };
  }

  async findUserIdByBloodGroup(bloodGroup: string) {
    const users = await this.userDataSource
      .createQueryBuilder()
      .from('account_profile', 'account_profile')
      .select('account_profile.user_id')
      .where('account_profile.blood_group = :bloodGroup', {
        bloodGroup: bloodGroup,
      })
      .getRawMany();

    return users.map((user) => user.user_id); //TODO: Check for alternative solution without using .map()
  }
}

@Injectable()
export class PermissionService {
  constructor(
    @InjectDataSource('usersConnection')
    private permissionDataSource: DataSource,
  ) {}

  async findOne(id: number) {
    const permission = await this.permissionDataSource
      .createQueryBuilder()
      .from('auth_permission', 'auth_permission')
      .where('auth_permission.id = :id', { id: id })
      .getRawOne();
    if (!permission) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }
    return permission;
  }

  async findAllPermissionsUser(userId: number) {
    const permissions = await this.permissionDataSource
      .createQueryBuilder()
      .from('account_user_user_permissions', 'account_user_user_permissions')
      .where('account_user_user_permissions.user_id = :userId', {
        userId: userId,
      })
      .getRawMany();
    return permissions;
  }

  async findAllPermissionsGroup(groupId: any) {
    const permissions = await this.permissionDataSource
      .createQueryBuilder()
      .from('auth_group_permissions', 'auth_group_permissions')
      .where('auth_group_permissions.group_id IN (:...groupId)')
      .setParameter('groupId', groupId)
      .getRawMany();
    return permissions;
  }

  async findAllGroupsUser(userId: number) {
    const groups = await this.permissionDataSource
      .createQueryBuilder()
      .from('account_user_groups', 'account_user_groups')
      .where('account_user_groups.user_id = :userId', { userId: userId })
      .getRawMany();
    return groups;
  }

  async findOnePermissionCodename(codename: string) {
    const permission = await this.permissionDataSource
      .createQueryBuilder()
      .from('auth_permission', 'auth_permission')
      .where('auth_permission.codename = :codename', { codename: codename })
      .getRawOne();
    if (!permission) {
      throw new NotFoundException(
        `Permission with codename ${codename} not found`,
      );
    }
    return permission;
  }

  async findAllPermissions(userId: number) {
    const userGroup = await this.findAllGroupsUser(userId);
    const groupId = userGroup.map((group) => group.group_id);
    const groupPermission = await this.findAllPermissionsGroup(groupId);
    const userPermission = await this.findAllPermissionsUser(userId);
    const permissions = [...groupPermission, ...userPermission];
    return permissions;
  }

  async hasPermission(userId: number, codename: string) {
    const permissionObject = await this.findOnePermissionCodename(codename);
    const permissionsUser = await this.findAllPermissions(userId);
    const permissionUser = permissionsUser.find(
      (permission) => permission.permission_id === permissionObject.id,
    );
    return permissionUser !== undefined;
  }
}
