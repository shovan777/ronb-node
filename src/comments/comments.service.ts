import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/decorators/user.decorator';
import {
  checkUserAuthenticated,
  checkUserIsAuthor,
} from 'src/common/utils/checkUserAuthentication';
import { NewsService } from 'src/news/news.service';
import { DataSource, Repository } from 'typeorm';
import {
  CreateNewsCommentInput,
  CreateNewsReplyInput,
} from './dto/create-comment.input';
import {
  UpdateNewsCommentInput,
  UpdateNewsReplyInput,
} from './dto/update-comment.input';
import {
  NewsComment,
  NewsReply,
  UserLikesNewsComment,
  UserLikesNewsReply,
} from './entities/comment.entity';

@Injectable()
export class NewsCommentsService {
  constructor(
    @InjectRepository(NewsComment)
    private newsCommentRepository: Repository<NewsComment>,
    private readonly newsService: NewsService,
  ) {}

  async create(
    createCommentInput: CreateNewsCommentInput,
    user: number,
  ): Promise<NewsComment> {
    let commentInputData: any = {
      ...createCommentInput,
    };
    const news = await this.newsService.findOne(createCommentInput.news);
    commentInputData = {
      ...commentInputData,
      news: news,
    };
    return this.newsCommentRepository.save({
      ...commentInputData,
      author: user,
    });
  }

  async findAll(
    newsId: number,
    limit: number,
    offset: number,
  ): Promise<[NewsComment[], number]> {
    return this.newsCommentRepository.findAndCount({
      where: {
        news: { id: newsId },
      },
      take: limit,
      skip: offset,
      // relations: { news: true },
    });
  }

  async findOne(id: number) {
    const newsComment = await this.newsCommentRepository.findOne({
      where: {
        id,
      },
    });
    if (!newsComment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return newsComment;
  }

  async update(
    id: number,
    updateCommentInput: UpdateNewsCommentInput,
    user: number,
  ): Promise<NewsComment> {
    const comment: NewsComment = await this.findOne(id);
    checkUserIsAuthor(user, comment.author);
    return this.newsCommentRepository.save({
      ...comment,
      ...updateCommentInput,
    });
  }

  async remove(id: number, user: number) {
    const comment: NewsComment = await this.findOne(id);
    checkUserIsAuthor(user, comment.author);
    await this.newsCommentRepository.delete(comment.id);
    return comment;
  }

  async countReplies(commentId: number) {
    const comment = await this.newsCommentRepository.findOne({
      where: { id: commentId },
      relations: { replies: true },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    return comment.replies.length;
  }

  async countLikes(commentId: number) {
    const comment = await this.newsCommentRepository.findOne({
      where: { id: commentId },
      relations: { likes: true },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    return comment.likes.length;
  }
  // async findUserLikesNewsComment(commentId: number, user: number) {
  //   const comment = await this.newsCommentLikeService.findOne(commentId, user);
  //   return comment;
  // }
}

@Injectable()
export class NewsRepliesService {
  constructor(
    @InjectRepository(NewsReply)
    private newsReplyRepository: Repository<NewsReply>,
    private newsCommentService: NewsCommentsService,
  ) {}
  async create(
    createReplyInput: CreateNewsReplyInput,
    user: number,
  ): Promise<NewsComment> {
    let commentInputData: any = {
      ...createReplyInput,
    };
    const commentId = createReplyInput.comment;
    const comment = await this.newsCommentService.findOne(commentId);
    commentInputData = {
      ...commentInputData,
      comment: comment,
      author: user,
    };
    return this.newsReplyRepository.save({
      ...commentInputData,
    });
  }

  async findAll(
    commentId: number,
    limit: number,
    offset: number,
  ): Promise<[NewsReply[], number]> {
    return this.newsReplyRepository.findAndCount({
      where: {
        comment: { id: commentId },
      },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<NewsReply> {
    const newsReply: NewsReply = await this.newsReplyRepository.findOne({
      where: { id },
    });
    if (!newsReply) {
      throw new NotFoundException(`Reply with id ${id} not found`);
    }
    return newsReply;
  }

  async update(
    id: number,
    updateReplyInput: UpdateNewsReplyInput,
    user: number,
  ): Promise<NewsReply> {
    const reply: NewsReply = await this.findOne(id);
    checkUserIsAuthor(user, reply.author);
    return this.newsReplyRepository.save({
      ...reply,
      ...updateReplyInput,
    });
  }

  async remove(id: number, user: number): Promise<NewsReply> {
    const reply: NewsReply = await this.findOne(id);
    checkUserIsAuthor(user, reply.author);
    await this.newsReplyRepository.delete(reply.id);
    return reply;
  }

  async countLikes(replyId: number) {
    const reply = await this.newsReplyRepository.findOne({
      where: { id: replyId },
      relations: { likes: true },
    });
    if (!reply) {
      throw new NotFoundException(`Reply with id ${replyId} not found`);
    }
    return reply.likes.length;
  }
}

@Injectable()
export class UserLikesNewsCommentService {
  constructor(
    @InjectRepository(UserLikesNewsComment)
    private userLikesNewsCommentRepository: Repository<UserLikesNewsComment>,
    private newsCommentService: NewsCommentsService,
  ) {}
  async create(commentId: number, user: number): Promise<UserLikesNewsComment> {
    const comment = await this.newsCommentService.findOne(commentId);
    return this.userLikesNewsCommentRepository.save({
      comment: comment,
      userId: user,
    });
  }

  async findOne(commentId: number, user: number) {
    const userLikesNewsComment =
      await this.userLikesNewsCommentRepository.findOne({
        where: {
          comment: { id: commentId },
          userId: user,
        },
      });
    return userLikesNewsComment;
  }

  async remove(commentId: number, user: number) {
    const userLikesNewsComment = await this.findOne(commentId, user);
    if (!userLikesNewsComment) {
      throw new NotFoundException(
        `User id ${user} has not liked the comment with id ${commentId}`,
      );
    }
    const removedUserLikesNewsComment = { ...userLikesNewsComment };
    await this.userLikesNewsCommentRepository.remove(userLikesNewsComment);
    return removedUserLikesNewsComment;
  }
}

@Injectable()
export class UserLikesNewsReplyService {
  constructor(
    @InjectRepository(UserLikesNewsReply)
    private userLikesNewsReplyRepository: Repository<UserLikesNewsReply>,
    private newsReplyService: NewsRepliesService,
  ) {}
  async create(replyId: number, user: number): Promise<UserLikesNewsReply> {
    const reply = await this.newsReplyService.findOne(replyId);
    return this.userLikesNewsReplyRepository.save({
      reply: reply,
      userId: user,
    });
  }

  async findOne(replyId: number, user: number) {
    const UserLikesNewsReplyService =
      await this.userLikesNewsReplyRepository.findOne({
        where: {
          reply: { id: replyId },
          userId: user,
        },
      });
    return UserLikesNewsReplyService;
  }

  async remove(replyId: number, user: number) {
    const userLikesNewsReply = await this.findOne(replyId, user);
    if (!userLikesNewsReply) {
      throw new NotFoundException(
        `User id ${user} has not liked the reply with id ${replyId}`,
      );
    }
    const removedUserLikesNewsReply = { ...userLikesNewsReply };
    await this.userLikesNewsReplyRepository.remove(userLikesNewsReply);
    return removedUserLikesNewsReply;
  }
}

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
    user.profile = await this.userDataSource
      .createQueryBuilder()
      .from('account_profile', 'account_profile')
      .where('account_profile.user_id = :id', { id: id })
      .getRawOne();
    // console.log(user);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
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
