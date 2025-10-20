<?php

namespace App;

enum TaskStatus: string
{
    case OPEN = 'open';
    case CLOSED = 'closed';
}
