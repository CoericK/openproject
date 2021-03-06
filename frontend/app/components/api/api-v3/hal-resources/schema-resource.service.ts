//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

import {opApiModule} from '../../../../angular-modules';
import {States} from '../../../states.service';
import {CollectionResource} from './collection-resource.service';
import {HalResource} from './hal-resource.service';

var states:States;

export class SchemaResource extends HalResource {
  [attribute:string]:any;

  // @ts-ignore
  public get state() {
    return states.schemas.get(this.href as string);
  }

  public get availableAttributes() {
    return _.keys(this.$source).filter(name => name.indexOf('_') !== 0);
  }

  public $initialize(source:any) {
    super.$initialize(source);

    initializeSchemaResource(this);
  }
}

export class SchemaAttributeObject {
  public type:string;
  public name:string;
  public required:boolean;
  public hasDefault:boolean;
  public writable:boolean;
  public allowedValues:HalResource[] | CollectionResource;
}

function initializeSchemaResource(halResource:SchemaResource) {
  proxyProperties();

  function proxyProperties() {
    _.without(Object.keys(halResource.$source), '_links', '_embedded').forEach(property => {
      Object.defineProperty(halResource, property, {
        get() {
          return HalResource.create(halResource.$source[property]);
        },

        enumerable: true,
        configurable: true
      });
    });
  }
}

function schemaResource(...args:any[]) {
  [
    states,
  ] = args;
  return SchemaResource;
}

schemaResource.$inject = [
  'states',
];

opApiModule.factory('SchemaResource', schemaResource);
