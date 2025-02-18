import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { DeleteReservationDto } from './dto/delete-reservation.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../decorator/role.decorator';
import { Role } from '../enum/role.enum';
import { User } from '../decorator/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly userService: UserService,
  ) {}

  @ApiBody({ type: CreateReservationDto })
  @Roles(Role.User)
  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Roles(Role.User)
  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Roles(Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOneById(+id);
  }

  @Roles(Role.User)
  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.reservationService.findByUser(+id);
  }

  @ApiBody({ type: UpdateReservationDto })
  @Roles(Role.User)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @User() user: UserEntity,
  ) {
    const isAdmin = await this.userService.isAdmin(+user.id);
    return this.reservationService.update(+id, updateReservationDto, isAdmin ? user : null);
  }

  @ApiBody({ type: DeleteReservationDto })
  @Roles(Role.User)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Body() deleteReservationDto: DeleteReservationDto,
    @User() user: UserEntity,
  ) {
    const isAdmin = await this.userService.isAdmin(+user.id);
    return this.reservationService.remove(+id, deleteReservationDto, isAdmin ? user : null);
  }
}
