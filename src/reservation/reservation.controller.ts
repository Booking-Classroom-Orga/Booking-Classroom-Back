import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../decorator/role.decorator';
import { Role } from '../enum/role.enum';
import { User } from '../decorator/user.decorator';
import { DeleteReservationDto } from './dto/delete-reservation.dto';
import { UserEntity } from '../user/entities/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

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
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @ApiBody({ type: DeleteReservationDto })
  @Roles(Role.User)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Body() deleteReservationDto: DeleteReservationDto,
    @User() user: UserEntity,
  ) {
    const isAdmin = user.roles.includes(Role.Admin);
    return this.reservationService.remove(+id, deleteReservationDto, isAdmin ? user : null);
  }
}
