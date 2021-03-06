# -*- coding: utf-8 -*-
"""
Copyright (C) 2014 Nicolas Can
Ce programme est un logiciel libre : vous pouvez
le redistribuer et/ou le modifier sous les termes
de la licence GNU Public Licence telle que publiée
par la Free Software Foundation, soit dans la
version 3 de la licence, ou (selon votre choix)
toute version ultérieure. 
Ce programme est distribué avec l'espoir
qu'il sera utile, mais SANS AUCUNE
GARANTIE : sans même les garanties
implicites de VALEUR MARCHANDE ou
D'APPLICABILITÉ À UN BUT PRÉCIS. Voir
la licence GNU General Public License
pour plus de détails.
Vous devriez avoir reçu une copie de la licence
GNU General Public Licence
avec ce programme. Si ce n'est pas le cas,
voir http://www.gnu.org/licenses/
"""
from pods.models import Pod, Channel, Type, Discipline
from django.contrib.sites.models import Site
from django.conf import settings as django_settings
from django.contrib.auth.models import User

def items_menu_header(request):
    return {
            'CHANNELS': Channel.objects.filter(visible=True),
            'TYPES' : Type.objects.all(),
            'DISCIPLINES' : Discipline.objects.all(),
            'OWNERS' : User.objects.filter(pod__in=Pod.objects.filter(is_draft=False, encodingpods__gt=0).distinct()).order_by('last_name').distinct() #User.objects.all()
    }